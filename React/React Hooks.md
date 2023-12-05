# React Hooks

## 官方的 Hooks

- useState:
用于在函数组件中添加状态
示例：const [state, setState] = useState(initialState);

- useEffect:
用于处理副作用操作，比如数据获取、订阅、手动修改 DOM
示例：useEffect(() => { // effect code }, [dependencies]);

- useContext:
用于从 React 上下文中获取值
示例：const value = useContext(MyContext);

- useReducer:
类似于 Redux 中的 reducer，用于在函数组件中管理复杂的状态逻辑
示例：const [state, dispatch] = useReducer(reducer, initialState);

- useCallback:
用于记忆化回调函数，以便在依赖项变化时不重新创建它
示例：const memoizedCallback = useCallback(() => { // callback code }, [dependencies]);

- useMemo:
用于记忆化计算结果，以便在依赖项变化时不重新计算
示例：const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

- useRef:
获取 React 元素或变量的引用
示例：const myRef = useRef(initialValue);

- useImperativeHandle:
用于自定义暴露给父组件的实例值，可以控制父组件如何操作子组件
示例：useImperativeHandle(ref, () => ({/* values or functions */}), [/* dependencies */]);

- useLayoutEffect:
与 useEffect 类似，但会在所有的 DOM 变更之后同步触发
示例：useLayoutEffect(() => { // effect code }, [dependencies]);

- useDebugValue:
用于在 React 开发者工具中显示自定义 hook 的 label
示例：useDebugValue(value);

## 问题与解答

问题：React 中的 memo 是用来做什么的？

答案：memo 是 React 中的一个高阶组件，用于优化函数组件的性能。它可以记忆（缓存）组件的渲染结果，只在组件的 props 发生变化时重新渲染组件，避免不必要的渲染

问题：useCallback 是什么，它在 React 中的作用是什么？

答案：useCallback 是 React 中的一个 Hook，用于记忆化函数。它返回一个记忆化的版本的回调函数，当依赖项发生变化时，它会返回新的回调函数。
这在防止不必要的函数重新创建和传递给子组件时非常有用，特别是在使用 memo 进行性能优化时

问题：useMemo 和 useCallback 有什么区别？

答案：useMemo 和 useCallback 都是用于性能优化的 Hooks，但它们的主要区别在于用途。useMemo 用于记忆化计算结果，而 useCallback 用于记忆化函数。
useMemo 接受一个函数和依赖项数组，返回记忆化的值，而 useCallback 接受一个函数和依赖项数组，返回记忆化的回调函数

问题：为什么在使用 memo 和 useCallback 时需要注意传递依赖项数组？

答案：依赖项数组是一个参数，用于告诉 React 在数组中的值发生变化时才重新计算或重新创建 memoized 值或回调函数。
如果不正确地使用依赖项数组，可能会导致 memoized 值或回调函数不会在预期的情况下更新，从而影响组件的正确性和性能

问题：React 中什么情况下应该使用 memo 和 useCallback 进行性能优化？

答案：memo 和 useCallback 主要用于性能优化，特别是在组件渲染频繁或计算开销较大的情况下。一般来说，当组件渲染的结果不受某些 props 的影响时，可以使用 memo 进行组件级别的优化。
而在传递给子组件的回调函数中，如果这些回调函数是通过父组件的渲染过程创建的，可以使用 useCallback 来避免不必要的函数重新创建，提高性能
