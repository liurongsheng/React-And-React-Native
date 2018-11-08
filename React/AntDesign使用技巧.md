# AntDesign使用技巧

## Table 组件

要判断一个列表项显示使用两个属性

children:paramType==='outcome'? '': [],
colSpan: paramType==='outcome'? 1 : 0,

```
let columns = [{
      title: '创建时间',
      width:100,
      dataIndex: 'creationDate',
      render: c => formatTime(c)
    }, {
      title: '名称|商户订单号',
      dataIndex: 'description',
      render: (data, row) => <Col><span>{hideLongStr(data)}</span><br/><span>{hideLongStr(row.outTradeNo)}</span></Col>
    }, {
      title: '交易号',
      dataIndex: 'tradeNo',
      render: data => hideLongStr(data)
    }, {
      title: paramType==='outcome'?'买家信息':'卖家信息',
      dataIndex: 'buyer',
      render: (data, row) => paramType==='outcome'?<Col><span>{hideLongStr(data)}</span><br/><span>{hideLongStr(row.buyerName)}</span></Col>:
                  <Col><span>{hideLongStr(row.seller)}</span><br/><span>{hideLongStr(row.sellerName)}</span></Col>
    }, {
      title: '订单金额(元)',
      dataIndex: 'totalPrice',
      render: data => formatMoney(data)
    }, {
      title: '退款金额(元)',
      dataIndex: 'refundedPrice',
      render: data => formatMoney(data)
    }, {
      title: '服务费(元)',
      dataIndex: 'serviceFee',
      children:paramType==='outcome'? '': [],
      colSpan: paramType==='outcome'?1:0,
      render: data => formatMoney(data)
    }, {
      title: '服务产品',
      dataIndex: 'serviceFeeType',
      render: data => data ? serviceType[data === 'COMMISION' ? 'NORMAL_PAY' : data.toUpperCase()] : ''
    }, {
      title: '交易状态',
      dataIndex: 'status',
      render: (data, row) => row.isRefund ? refundStatus[data] : invoiceStatus[data]
    }, {
      title: '操作',
      render: row =>((paramType==='outcome' && invoiceStatus[row.status]=== '待付款')?
        <span><Link to={`/tradingCenter/trade/${paramType}/${row.id}`}>详情</Link></span>:
        <Link to={`/tradingCenter/trade/${paramType}/${row.id}`}>详情</Link>)
    }];
```

使用系列号问题
```
{ 
title: '序号',
className: 'column-middle', 
dataIndex: 'key', 
render: (k, row, index) => index/1+1 
},
```
`k, row, index` 这里必须使用三个参数，第三个参数才是 index，index 需要强制装换为数字，所以使用 index/1 
