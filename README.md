# ioc-typescript
一个高效轻量级的 ioc 控制反转和DI 依赖注入的typescript 库

#### 基本使用 ContainerBase
```typescript
// import {ContainerBase,Injectable} from "../index"
import {ContainerBase,Injectable} from "ioc-typescript"


@Injectable()
class A{
    
    getA(){
       
        console.log("class A method getA")
    }
}

@Injectable()
class B{
    constructor(private a:A){}
    getB(){
        this.a.getA()
        console.log("class B method getB")
    }
}

const containerIns = new ContainerBase()
containerIns.addProviders<any>([A,B]).initLoading()

let ins = containerIns.getInstances()
ins.forEach((val,key)=>{
    console.log("get-ins",key,val) ; // log 输出： get-ins [class A] A {}, get-ins [class B] B { a: A {} }
})
const insB:B = ins.get(B)
insB.getB() ; // log 输出:class A method getA,  class B method getB


```

#### 示例二 :Container 与 Module

``` typescript

// import {Container,Injectable, Module} from "../index"
import {Container,Injectable, Module} from "ioc-typescript"


@Injectable()
class A{
    
    getA(){
       
        console.log("class A method getA")
    }
}

@Injectable()
class B{
    constructor(private a:A){}
    getB(){
        this.a.getA()
        console.log("class B method getB")
    }
}

@Module({
    providers:[A],
    controllers:[], // 这个特殊是providers 
    imports:[]
})
class Ma{}


@Module({
    providers:[B],
    imports:[Ma]
})
class Mb{}

const containerIns = new Container(Mb)
let ins = containerIns.getInstances()
ins.forEach((val,key)=>{
    /** log 输出：
     *  get-ins [class Mb] Mb {}
        get-ins [class B] B { a: A {} }
        get-ins [class Ma] Ma {}
        get-ins [class A] A {}
     */
    console.log("get-ins",key,val) ; 
})
const insB:B = ins.get(B)
/** log 输出:
 *  class A method getA
 *  class B method getB
 */
insB.getB() ; 

```

#### 示例三： 循环依赖forwardRef
- A类实例化的时候依赖B类 ,B类的实例化的时候依赖A类 ,这样就造成了依赖循环
-  主意： 不能 A 类的a 方法里面调用B 类的 a 方法，然后B 类的 a 方法 又调用了A 类的a 方法 ，这种就是死循环，无解

------------
>  src/depA.ts


```typescript

// import { Injectable ,Inject,forwardRef} from "../../index";
import { Injectable ,Inject,forwardRef} from "ioc-typescript";
import { B } from "./depB";


@Injectable()
export class A {
  constructor(@Inject(forwardRef(()=>B)) private b:B){}
  getA() {
    this.b.getA()
    console.log("class A methond getA");
  }

  getB() {
    console.log("class A methond getB");
  }
}

```
>  src/depB.ts

```typescript
// import { Injectable ,Inject,forwardRef} from "../../index";
import { Injectable ,Inject,forwardRef} from "ioc-typescript";
import { A } from "./depA";


@Injectable()
export class B {
  constructor(@Inject(forwardRef(()=>A)) private a:A){}
  getA() {
    console.log("class B methond getA");
  }
  getB() {
    this.a.getB()
    console.log("class B methond getB");
  }
}

```

> src/index.ts

```typescript

// import {Container,forwardRef, Module} from "../../index"
import {Container,Injectable, Module} from "ioc-typescript"
import {A} from "./depA"
import {B} from "./depB"


@Module({
    providers:[forwardRef(()=>A),forwardRef(()=>B)],
    imports:[]
})
class M{}

const containerIns = new Container(M)
let ins = containerIns.getInstances()
ins.forEach((val,key)=>{
    /** log 输出：
      get-ins [class M] M {}
      get-ins [class A] <ref *1> A { b: B { a: [Circular *1] } }
      get-ins [class B] <ref *1> B { a: A { b: [Circular *1] } }
     */
    console.log("get-ins",key,val) ; 
})


/** log 输出:
*  class B methond getA
*  class A methond getA
*/
const insA:A = ins.get(A)
insA.getA() ;



/** log 输出:
 * class A methond getB
 * class B methond getB
 */
const insB:B = ins.get(B)
insB.getB() ;

```

#### 示例4 ，三种绑定用法
 - 类绑定：{ provide， useClass}，
 - 工厂方法绑定: { provide，useFactory}
 - 值绑定： { provide，useValue}

```typescript
// import {Inject,InjectToken,Injectable,forwardRef,Container,Module} from "../index"
import {Inject,InjectToken,Injectable,forwardRef,Container,Module} from "ioc-typescript"


 const APP_URL = new InjectToken("APP_URL")

@Injectable()
class A{

    getA(){

        console.log("class A method getA")
    }
}

@Injectable()
class B{
    constructor(private a:A){}
    getB(){
        this.a.getA()
        console.log("class B method getB")
    }
}

@Injectable()
export class C{
    constructor(
        @Inject(APP_URL) private appUrl:string
    ){
        console.log(this.appUrl,"C int----------")
    }
}


@Module({
    providers: [
        A,
        {provide:B,useClass:B},
        {provide:C,useClass:forwardRef(()=>C)},
        {
        provide: APP_URL,
            useFactory: () => "http://www.baidu.com",
        },
        {provide:"useValue",useValue:"this is useValue"},
        {provide:"useFactory",useFactory:()=>"this is useFactory"},
        {provide:"config",useValue:()=>({  id:12 })}
    ],
    controllers: [],
  })
  class userApp {
    constructor() {
      console.log("userApp init....");
    }
  }



  const containerIns = new Container(userApp);
  let ins = containerIns.getInstances()

  ins.forEach((val,key)=>{
     /**
      * log 输出：
      * userApp init....
        http://www.baidu.com C int----------
        get-ins key:---: [class userApp] ----val---: userApp {}
        get-ins key:---: [class A] ----val---: A {}
        get-ins key:---: [class B] ----val---: B { a: A {} }
        get-ins key:---: InjectToken { injectIdefer: 'APP_URL' } ----val---: http://www.baidu.com
        get-ins key:---: useValue ----val---: this is useValue
        get-ins key:---: useFactory ----val---: this is useFactory
        get-ins key:---: config ----val---: [Function: useValue]
        get-ins key:---: [class C] ----val---: C { appUrl: 'http://www.baidu.com' }
      */
      console.log("get-ins","key:---:",key,"----val---:",val)
  })



```


### APi 参数说明
一、  提供两个容器,ContainerBase 与 Container ，Container 是增强版继承与ContainerBase， 与@Module 结合使用
1、ContainerBase：
构造函数参数：无
实例方法有：
  - getInstances()： 获取所有容器已经注册的服务 
  
  - addProvider(provider:Type<T> | Provider<T> | IforwardRef<T>)： 单个添加已经被注解的类，或者工厂函数，值
  
  - addProviders(providers:Array<Type<T> | Provider<T> | IforwardRef<T>>): 批量添加已经被注解的类，或者工厂函数，值
  
  - bind(provider:Provider<T>): 单个绑定注入,约定三种结构：`{provide:"",useClass:}、{provide:"",useFactory:} 、 {provide:"",useValue:}`
  
  - initLoading()：初始化所有提供者服务Provider
  
  - get(type: Token<T>): 根据 provide 获取注入的服务

2、Container : 
 构造函数参数： 接受一个参数 使用@module 注入的服务
 实例方法: 继承ContainerBase
二、 提供三个注解方法 @Inject、@Injectable 、@Module

| 装饰器方法 | 描述                |
| ------------- | ------------------------------ |
| `@Inject`      | 构造函数参数的注入器       |
| `@Injectable`   |  标志可注入依赖   |
| `@Module`   | 标志可注入依赖的模块，接受一个参数对象 {providers，controllers，imports}     |

三、forwardRef：标志这是一个依赖循环的服务，接受一个函数，返回 一个provider
四、InjectToken：是一个构造类，用于生成一个 可以注入的provider服务