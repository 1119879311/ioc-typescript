import { Injectable ,Inject,forwardRef} from "../../src";

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

