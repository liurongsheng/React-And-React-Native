# 从 Java 层看 React-Native 通信机制

前言：

在react-native中的通信，主要是Java与JavaScript之间的通信，而实际上，Java与Js之间是根本没办法直接对话的，
别看他们看起来好像是亲戚，实际上他们的没有任何关系，那么Java和Js之间想要能听懂对方的话，有两个必备条件：

1. 双方的信息要能够传达到对方那里去，就是，先不管听不听的懂，你首先要把话传过去
2. 信息传达前需要经过翻译，才能被接受方正确理解。

第一个条件的解决方案是通过C++来做这个传话筒，Java通过JNI来call到c++层，然后c++层再把信息传到js，反之亦然；
第二个条件的解决方案就是通过在初始化的时候构造两本“词典”，约定好以后说话只说对方写好的“词典”上的单词，保证对方能听懂。

我们的问题其实只有两点：那就是集中精力观察“词典”是怎么传递到双方手里的，以及两方是怎么传递数据的。

## Java传递“词典”

首先，对于词典还是正确解释一下，它是某种config，某种配置文件，每次Java层收到js层传来的的信息，
都会读取这个文件，然后才能理解Java层的意思，Java层也是一样。
他们对应RN的代码的类分别是：** NativeModuleRegistry ** 和 ** JavaScriptModuleRegistry ** 

初始化的开端源自ReactActivity，这是react-native中的类，它的onCreate()方法中是这么做的：
```java
@Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    if (getUseDeveloperSupport() && Build.VERSION.SDK_INT >= 23) {
      // Get permission to show redbox in dev builds.
      if (!Settings.canDrawOverlays(this)) {
        Intent serviceIntent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION);
        startActivity(serviceIntent);
        FLog.w(ReactConstants.TAG, REDBOX_PERMISSION_MESSAGE);
        Toast.makeText(this, REDBOX_PERMISSION_MESSAGE, Toast.LENGTH_LONG).show();
      }
    }

    mReactRootView = createRootView();
    //这是最重要的一步
    mReactRootView.startReactApplication(
      getReactNativeHost().getReactInstanceManager(),
      getMainComponentName(),
      getLaunchOptions());
    setContentView(mReactRootView);
    mDoubleTapReloadRecognizer = new DoubleTapReloadRecognizer();
  }
```
mRootView是一个layout，继承自FrameLayout，一切的js渲染从这个Layout上开始，它的startReactApplication()方法如下：
```java
public void startReactApplication(
      ReactInstanceManager reactInstanceManager,
      String moduleName,
      @Nullable Bundle launchOptions) {
    UiThreadUtil.assertOnUiThread();

    // TODO(6788889): Use POJO instead of bundle here, apparently we can't just use WritableMap
    // here as it may be deallocated in native after passing via JNI bridge, but we want to reuse
    // it in the case of re-creating the catalyst instance
    Assertions.assertCondition(
        mReactInstanceManager == null,
        "This root view has already been attached to a catalyst instance manager");

    mReactInstanceManager = reactInstanceManager;
    mJSModuleName = moduleName;
    mLaunchOptions = launchOptions;

    //这是关键
    if (!mReactInstanceManager.hasStartedCreatingInitialContext()) {
      mReactInstanceManager.createReactContextInBackground();
    }

    // We need to wait for the initial onMeasure, if this view has not yet been measured, we set which
    // will make this view startReactApplication itself to instance manager once onMeasure is called.
    if (mWasMeasured) {
      attachToReactInstanceManager();
    }
  }
```
这里有一个ReactInstanceManager，它的作用就是管理CatalystInstance的实例，CatalystInstance是什么？
这是一个上层抽象的调用接口），Java和Js都可以通过这个去调用对方，当然，那两个类都是抽象的，实际上都是通过它们的XXXXImpl类来实现具体的功能。

那么我们接着往下，注意我们的目的：了解初始化时如何传递那两本“词典”的，
mReactInstanceManager.createReactContextInBackground();这个方法就直接调用到了它的实现类：
XReactInstanceManagerImpl中的createReactContextInBackground

然后接下来的流程就是：
createReactContextInBackground（）------>    recreateReactContextInBackgroundInner();
 ------->  recreateReactContextInBackgroundFromBundleLoader(); 
 --------->    recreateReactContextInBackground() ;

到了recreateReactContextInBackground()这个方法大概是这样的：
```java
 private void recreateReactContextInBackground(
      JavaScriptExecutor.Factory jsExecutorFactory,
      JSBundleLoader jsBundleLoader) {
    UiThreadUtil.assertOnUiThread();

    //构造参数
    ReactContextInitParams initParams =
        new ReactContextInitParams(jsExecutorFactory, jsBundleLoader);
    if (mReactContextInitAsyncTask == null) {
      // No background task to create react context is currently running, create and execute one.
      //执行了一个AsyncTask.......
      mReactContextInitAsyncTask = new ReactContextInitAsyncTask();
      mReactContextInitAsyncTask.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR, initParams);
    } else {
      // Background task is currently running, queue up most recent init params to recreate context
      // once task completes.
      mPendingReactContextInitParams = initParams;
    }
  }
```
好我们接下来看这个线程内部的细节,重点看doInBackground（）这个方法：
```java
 @Override
    protected Result<ReactApplicationContext> doInBackground(ReactContextInitParams... params) {
      // TODO(t11687218): Look over all threading
      // Default priority is Process.THREAD_PRIORITY_BACKGROUND which means we'll be put in a cgroup
      // that only has access to a small fraction of CPU time. The priority will be reset after
      // this task finishes: https://android.googlesource.com/platform/frameworks/base/+/
      d630f105e8bc0021541aacb4dc6498a49048ecea/core/java/android/os/AsyncTask.java#256
      Process.setThreadPriority(Process.THREAD_PRIORITY_DEFAULT);

      Assertions.assertCondition(params != null && params.length > 0 && params[0] != null);
      try {
        JavaScriptExecutor jsExecutor = params[0].getJsExecutorFactory().create();

        //createReactContext()这个方法被执行
        return Result.of(createReactContext(jsExecutor, params[0].getJsBundleLoader()));
      } catch (Exception e) {
        // Pass exception to onPostExecute() so it can be handled on the main thread
        return Result.of(e);
      }
    }
```
接下去看createReactContext(jsExecutor, params[0].getJsBundleLoader())这个方法：
```java
/**
   * @return instance of {@link ReactContext} configured a {@link CatalystInstance} set
   */
  private ReactApplicationContext createReactContext(
      JavaScriptExecutor jsExecutor,
      JSBundleLoader jsBundleLoader) {
    FLog.i(ReactConstants.TAG, "Creating react context.");
    ReactMarker.logMarker(CREATE_REACT_CONTEXT_START);
    mSourceUrl = jsBundleLoader.getSourceUrl();

    //你瞧，之前提到的两本“词典”，他们的Builder已经露面了。
    NativeModuleRegistry.Builder nativeRegistryBuilder = new NativeModuleRegistry.Builder();
    JavaScriptModuleRegistry.Builder jsModulesBuilder = new JavaScriptModuleRegistry.Builder();

    final ReactApplicationContext reactContext = new ReactApplicationContext(mApplicationContext);
    if (mUseDeveloperSupport) {
      reactContext.setNativeModuleCallExceptionHandler(mDevSupportManager);
    }

    ReactMarker.logMarker(PROCESS_PACKAGES_START);
    Systrace.beginSection(
        TRACE_TAG_REACT_JAVA_BRIDGE,
        "createAndProcessCoreModulesPackage");
    try {

    //CoreModulesPackage里面定义了RN框架核心的一些Java和JS的module
    //通过processPackage（）方法写入到两本“词典”的Builder中
      CoreModulesPackage coreModulesPackage =
          new CoreModulesPackage(this, mBackBtnHandler, mUIImplementationProvider);

      processPackage(coreModulesPackage, reactContext, nativeRegistryBuilder, jsModulesBuilder);
    } finally {
      Systrace.endSection(TRACE_TAG_REACT_JAVA_BRIDGE);
    }

    // TODO(6818138): Solve use-case of native/js modules overriding
    //这里是开发者自己定义或封装的一些组件或者事件的package
    for (ReactPackage reactPackage : mPackages) {
      Systrace.beginSection(
          TRACE_TAG_REACT_JAVA_BRIDGE,
          "createAndProcessCustomReactPackage");
      try {
        processPackage(reactPackage, reactContext, nativeRegistryBuilder, jsModulesBuilder);
      } finally {
        Systrace.endSection(TRACE_TAG_REACT_JAVA_BRIDGE);
      }
    }
    ReactMarker.logMarker(PROCESS_PACKAGES_END);

    ReactMarker.logMarker(BUILD_NATIVE_MODULE_REGISTRY_START);
    Systrace.beginSection(TRACE_TAG_REACT_JAVA_BRIDGE, "buildNativeModuleRegistry");
    NativeModuleRegistry nativeModuleRegistry;
    try {
        //好了，创建了用于翻译Java端的“词典”
       nativeModuleRegistry = nativeRegistryBuilder.build();
    } finally {
      Systrace.endSection(TRACE_TAG_REACT_JAVA_BRIDGE);
      ReactMarker.logMarker(BUILD_NATIVE_MODULE_REGISTRY_END);
    }

    NativeModuleCallExceptionHandler exceptionHandler = mNativeModuleCallExceptionHandler != null
        ? mNativeModuleCallExceptionHandler
        : mDevSupportManager;
    CatalystInstanceImpl.Builder catalystInstanceBuilder = new CatalystInstanceImpl.Builder()
        .setReactQueueConfigurationSpec(ReactQueueConfigurationSpec.createDefault())
        .setJSExecutor(jsExecutor)
        .setRegistry(nativeModuleRegistry)
        //创建了用于翻译JS端的“词典”
        .setJSModuleRegistry(jsModulesBuilder.build())
        .setJSBundleLoader(jsBundleLoader)
        .setNativeModuleCallExceptionHandler(exceptionHandler);

    //到目前为止。两本“词典”都已经创建完毕，而且全部都在CatalystInstance这个类的**实现类的Builder中**，此时你可以回忆一下整个过程，理清一下思路。

    ReactMarker.logMarker(CREATE_CATALYST_INSTANCE_START);
    // CREATE_CATALYST_INSTANCE_END is in JSCExecutor.cpp
    Systrace.beginSection(TRACE_TAG_REACT_JAVA_BRIDGE, "createCatalystInstance");
    final CatalystInstance catalystInstance;
    try {
      //这个Build（）很关键，它用实现类的Builder创建了一个CatalystInstance类。
      catalystInstance = catalystInstanceBuilder.build();
    } finally {
      Systrace.endSection(TRACE_TAG_REACT_JAVA_BRIDGE);
      ReactMarker.logMarker(CREATE_CATALYST_INSTANCE_END);
    }

    if (mBridgeIdleDebugListener != null) {
      catalystInstance.addBridgeIdleDebugListener(mBridgeIdleDebugListener);
    }

    ReactMarker.logMarker(RUN_JS_BUNDLE_START);
    try {
      catalystInstance.getReactQueueConfiguration().getJSQueueThread().callOnQueue(
        new Callable<Void>() {
          @Override
          public Void call() throws Exception {
            reactContext.initializeWithInstance(catalystInstance);

            Systrace.beginSection(TRACE_TAG_REACT_JAVA_BRIDGE, "runJSBundle");
            try {
                //在这里就运行js代码说明至少在这个方法之前，“词典”应该传过去了
                //于是我们刻印回去聚焦到catalystInstance = catalystInstanceBuilder.build();这段代码
              catalystInstance.runJSBundle();
            } finally {
              Systrace.endSection(TRACE_TAG_REACT_JAVA_BRIDGE);
              ReactMarker.logMarker(RUN_JS_BUNDLE_END);
            }
            return null;
          }
        }).get();
    } catch (InterruptedException e) {
      throw new RuntimeException(e);
    } catch (ExecutionException e) {
      if (e.getCause() instanceof RuntimeException) {
        throw (RuntimeException) e.getCause();
      } else {
        throw new RuntimeException(e);
      }
    }

    return reactContext;
  }

  //将package中的关于Java和js的东西分别添加到两本“词典”的builder中
   private void processPackage(
      ReactPackage reactPackage,
      ReactApplicationContext reactContext,
      NativeModuleRegistry.Builder nativeRegistryBuilder,
      JavaScriptModuleRegistry.Builder jsModulesBuilder) {
    for (NativeModule nativeModule : reactPackage.createNativeModules(reactContext)) {
      nativeRegistryBuilder.add(nativeModule);
    }
    for (Class<? extends JavaScriptModule> jsModuleClass : reactPackage.createJSModules()) {
      jsModulesBuilder.add(jsModuleClass);
    }
  }

```

catalystInstanceBuilder.build()这段代码具体实现如下：
```
public CatalystInstanceImpl build() {
  return new CatalystInstanceImpl(
      Assertions.assertNotNull(mReactQueueConfigurationSpec),
      Assertions.assertNotNull(mJSExecutor),
      Assertions.assertNotNull(mRegistry),
      Assertions.assertNotNull(mJSModuleRegistry),
      Assertions.assertNotNull(mJSBundleLoader),
      Assertions.assertNotNull(mNativeModuleCallExceptionHandler));
}
```
这个方法的作用就是直接new了一个CatalystInstanceImpl类，那么我们接下去看CatalystInstanceImpl类的构造方法：
```java
 private CatalystInstanceImpl(
      final ReactQueueConfigurationSpec ReactQueueConfigurationSpec,
      final JavaScriptExecutor jsExecutor,
      final NativeModuleRegistry registry,
      final JavaScriptModuleRegistry jsModuleRegistry,
      final JSBundleLoader jsBundleLoader,
      NativeModuleCallExceptionHandler nativeModuleCallExceptionHandler) {
    FLog.d(ReactConstants.TAG, "Initializing React Xplat Bridge.");
    mHybridData = initHybrid();

    mReactQueueConfiguration = ReactQueueConfigurationImpl.create(
        ReactQueueConfigurationSpec,
        new NativeExceptionHandler());
    mBridgeIdleListeners = new CopyOnWriteArrayList<>();
    //这个就是Java层要传递给Js层的“词典”
    mJavaRegistry = registry;
    mJSModuleRegistry = jsModuleRegistry;
    mJSBundleLoader = jsBundleLoader;
    mNativeModuleCallExceptionHandler = nativeModuleCallExceptionHandler;
    mTraceListener = new JSProfilerTraceListener(this);

    //在这个方法里，就把Java暴露给Js的词典传了进去
    initializeBridge(
      new BridgeCallback(this),
      jsExecutor,
      mReactQueueConfiguration.getJSQueueThread(),
      mReactQueueConfiguration.getNativeModulesQueueThread(),
      //getModuleRegistryHolder（）这个方法不过是一种holder,对“词典”做了一些封装。
      mJavaRegistry.getModuleRegistryHolder(this));
    mMainExecutorToken = getMainExecutorToken();
  }

  //你瞧，native方法，直接call到C++层，接下来，由C++层通过各种折腾，然后生成某种配置文件，转发到Js端
   private native void initializeBridge(ReactCallback callback,
                                       JavaScriptExecutor jsExecutor,
                                       MessageQueueThread jsQueue,
                                       MessageQueueThread moduleQueue,
                                       ModuleRegistryHolder registryHolder);
```
好了，关于“词典”是如何传递过去的，就解释到这里，虽然C++层可能有更多操作，但是目的就是一个，
把Java类转化成一个JS读得懂的格式的文件。那么我们接下来看看C++是如何做好传声筒的

## 数据传递过程

>初始化完成之后，Java端和Js端都有了“词典”，就可把自己的意图翻译成对方能听得懂的话了，这个时候交流就会畅通了。

Java --> Js

这个问题首先Java层应该做的是找到那本Js的词典，所以我们应该寻找Java层是在哪里调用到了JSModuleRegistry这个类的，
让我们退回到ReactContextInitAsyncTask的doInBackground方法中，在词典传递完毕之后，这个方法基本执行完毕，接下来是
```java
@Override
    protected void onPostExecute(Result<ReactApplicationContext> result) {
      try {
        setupReactContext(result.get());
      } catch (Exception e) {
        mDevSupportManager.handleException(e);
      } finally {
        mReactContextInitAsyncTask = null;
      }

      // Handle enqueued request to re-initialize react context.
      if (mPendingReactContextInitParams != null) {
        recreateReactContextInBackground(
            mPendingReactContextInitParams.getJsExecutorFactory(),
            mPendingReactContextInitParams.getJsBundleLoader());
        mPendingReactContextInitParams = null;
      }
    }
```
setupReactContext(result.get())这个方法,然后这个方法又会调用attachMeasuredRootViewToInstance（）方法：
```java
private void attachMeasuredRootViewToInstance(
      ReactRootView rootView,
      CatalystInstance catalystInstance) {
    Systrace.beginSection(TRACE_TAG_REACT_JAVA_BRIDGE, "attachMeasuredRootViewToInstance");
    UiThreadUtil.assertOnUiThread();

    // Reset view content as it's going to be populated by the application content from JS
    rootView.removeAllViews();
    rootView.setId(View.NO_ID);

    UIManagerModule uiManagerModule = catalystInstance.getNativeModule(UIManagerModule.class);
    int rootTag = uiManagerModule.addMeasuredRootView(rootView);
    rootView.setRootViewTag(rootTag);
    @Nullable Bundle launchOptions = rootView.getLaunchOptions();
    WritableMap initialProps = Arguments.makeNativeMap(launchOptions);
    String jsAppModuleName = rootView.getJSModuleName();

    WritableNativeMap appParams = new WritableNativeMap();
    appParams.putDouble("rootTag", rootTag);
    appParams.putMap("initialProps", initialProps);

    //在这里，Java找到了那本Js的“词典”，然后runApplication
    catalystInstance.getJSModule(AppRegistry.class).runApplication(jsAppModuleName, appParams);
    Systrace.endSection(TRACE_TAG_REACT_JAVA_BRIDGE);
  }
```
其实catalystInstance.getJSModule(AppRegistry.class).runApplication(jsAppModuleName, appParams)这段代码比较复杂，
首先getJSModule方法具体实现在catalystInstanceImpl中，然后会调用到mJSModuleRegistry.getJavaScriptModule(this, executorToken, jsInterface)中，代码如下：
```java
public synchronized <T extends JavaScriptModule> T getJavaScriptModule(
    CatalystInstance instance,
    ExecutorToken executorToken,
    Class<T> moduleInterface) {
    HashMap<Class<? extends JavaScriptModule>, JavaScriptModule> instancesForContext =
        mModuleInstances.get(executorToken);
    if (instancesForContext == null) {
      instancesForContext = new HashMap<>();
      mModuleInstances.put(executorToken, instancesForContext);
    }

    JavaScriptModule module = instancesForContext.get(moduleInterface);
    if (module != null) {
      return (T) module;
    }

    JavaScriptModuleRegistration registration =
        Assertions.assertNotNull(
            mModuleRegistrations.get(moduleInterface),
            "JS module " + moduleInterface.getSimpleName() + " hasn't been registered!");
    //关键
    JavaScriptModule interfaceProxy = (JavaScriptModule) Proxy.newProxyInstance(
        moduleInterface.getClassLoader(),
        new Class[]{moduleInterface},
        new JavaScriptModuleInvocationHandler(executorToken, instance, registration));
    instancesForContext.put(moduleInterface, interfaceProxy);
    return (T) interfaceProxy;
  }
```
什么动态代理不用理他，看 new JavaScriptModuleInvocationHandler(executorToken, instance, registration)这个类：
```java
 private static class JavaScriptModuleInvocationHandler implements InvocationHandler {

    private final WeakReference<ExecutorToken> mExecutorToken;
    private final CatalystInstance mCatalystInstance;
    private final JavaScriptModuleRegistration mModuleRegistration;

    public JavaScriptModuleInvocationHandler(
        ExecutorToken executorToken,
        CatalystInstance catalystInstance,
        JavaScriptModuleRegistration moduleRegistration) {
      mExecutorToken = new WeakReference<>(executorToken);
      mCatalystInstance = catalystInstance;
      mModuleRegistration = moduleRegistration;
    }

    //关键
    @Override
    public @Nullable Object invoke(Object proxy, Method method, @Nullable Object[] args) throws Throwable {
      ExecutorToken executorToken = mExecutorToken.get();
      if (executorToken == null) {
        FLog.w(ReactConstants.TAG, "Dropping JS call, ExecutorToken went away...");
        return null;
      }
      NativeArray jsArgs = args != null ? Arguments.fromJavaArgs(args) : new WritableNativeArray();
      mCatalystInstance.callFunction(
        executorToken,
        mModuleRegistration.getName(),
        method.getName(),
        jsArgs
      );
      return null;
    }
  }
}
```
invoke方法通过mCatalystInstance调用了callFunction（）方法；不用多想，我们直接在实现类中去找这个方法：
```java
@Override
  public void callFunction(
      ExecutorToken executorToken,
      final String module,
      final String method,
      final NativeArray arguments) {
    if (mDestroyed) {
      FLog.w(ReactConstants.TAG, "Calling JS function after bridge has been destroyed.");
      return;
    }
    if (!mAcceptCalls) {
      throw new RuntimeException("Attempt to call JS function before JS bundle is loaded.");
    }

    callJSFunction(executorToken, module, method, arguments);
  }

    private native void callJSFunction(ExecutorToken token,String module, String method,NativeArray arguments);
```
callFunction()方法里面调用了callJSFunction（）这个本地方法，然后由C++做转发，这个本地方法传递的参数有token,包名，方法名，和参数,
至此，从Java端调用到Js端的过程，到这里可以宣告结束了。
