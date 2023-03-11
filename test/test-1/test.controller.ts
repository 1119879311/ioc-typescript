import "reflect-metadata";
// import {Controller,GET,Query,Ctx,setMetadata} from "../../../koa-router-decorator";
import {Inject,Injectable} from "../../index"
import { UserServer } from "./test.UserServer";
class db{
    name:string
    constructor(){
        this.name = "小明"
    }
}


@Injectable()
export class UserController extends db{
    a:number
    constructor(
       private userService:UserServer
    ){
        super()
        this.a = 123456
    }
    getd(){
        return "lallalla"
    }
}


