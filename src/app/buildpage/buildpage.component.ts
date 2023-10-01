import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { WatchpartsService } from '../services/watchparts.service';
import { Watchparts } from '../interfaces/watchparts';
import { ModalsServices } from '../services/help.service';
import { environment } from 'src/environments/environment.development';
import { UserCahedData } from '../interfaces/user-cahed-data';
import { Collection } from '../interfaces/collection';
import { MyResponse } from '../interfaces/my-response';

@Component({
  selector: 'app-buildpage',
  templateUrl: './buildpage.component.html',
  styleUrls: ['./buildpage.component.css']
})

export class BuildpageComponent implements OnInit{
  constructor (private watchserveice : WatchpartsService, private modal : ModalsServices){}

  oneDial: string | undefined
  oneStrap: string | undefined
  oneCase: string | undefined

  dialPrice : number = 0
  strapPrice : number = 0 
  casePrice : number = 0 
  total:number = 0

  @Input() userData !: UserCahedData;
  @Input() mobile_collection !: boolean

  @Output() mob_to_open :EventEmitter<boolean> = new EventEmitter()

  dial: Watchparts[] | undefined;
  case: Watchparts[] | undefined;
  strap: Watchparts[] | undefined;


  collection_list: Collection[] | undefined

  ngOnInit(): void {
    this.onGetwatchparts()
    this.get_collections_data()
  }

  mob_changer(){
    this.mob_to_open.emit(false)
  }

  onGetwatchparts(run?: ()=> void): void {
    this.watchserveice.getWatchParts().subscribe({
      next: (response) => {
        let dial = [], watchcase = [], strap = []
        for(let i of response){
          i.pathName = environment.BASE_URL + i.category + '/' + i.path
          if(i.category == 'case'){
            watchcase.push(i)
          }else if(i.category == 'strap'){
            strap.push(i)
          }else{
            dial.push(i)
          }
        }
        this.case = watchcase
        this.dial = dial
        this.strap = strap
      },
      error: (err : any) => {
        this.modal.ondialog(err.message + " .Try again?",0,()=>{
          this.onGetwatchparts(() => this.onShuffle())
        })
      },
      complete: () => {if(run) run()}
    })
  }

  randomSet (type: string): string {
    let result: string = "failed"
    if(this.case && this.dial && this.strap){
      switch(type){
        case 'dial': 
            result = this.dial[Math.floor(Math.random() * this.dial.length)].pathName 
          break
        case 'strap':
            result = this.strap[Math.floor(Math.random() * this.strap.length)].pathName 
          break
        default:
          result = this.case[Math.floor(Math.random() * this.case.length)].pathName 
          break
      }
    }
    return result
  }

  selectitemandsetit (urlofitem : string , category : string) : void {
    switch(category){
      case 'dial':
          this.oneDial = urlofitem
        break
      case 'strap':
          this.oneStrap = urlofitem
        break
      default:
        this.oneCase = urlofitem
      break
    }
    this.setBasedOnChange()
  }

  setBasedOnChange () : void {
    if(this.dial , this.strap , this.case){
      this.dial?.forEach(item => {
        if(item.pathName == this.oneDial){
          item.selected = true
          this.dialPrice = item.price
        }else{
          item.selected = false
        }
      })

      this.case?.forEach(item => {
        if(item.pathName == this.oneCase){
          item.selected = true
          this.casePrice = item.price
        }else{
          item.selected = false
        }
      })

      this.strap?.forEach(item => {
        if(item.pathName == this.oneStrap){
          item.selected = true
          this.strapPrice = item.price
        }else{
          item.selected = false
        }
      })
    }
    this.total = this.dialPrice + this.strapPrice + this.casePrice
  }
  onShuffle() : void{
        this.oneStrap = this.randomSet('strap')
        this.oneDial = this.randomSet('dial')
        this.oneCase = this.randomSet('case')
        this.setBasedOnChange()
  }

  saveCombination (): void {
    let user_data = localStorage.getItem("BUW_data")
    if(user_data){
      let j_data: UserCahedData = JSON.parse(user_data)
      if(j_data.verification) this.run_prod_overview()
      else this.modal.ondialog("oops, sorry you need to be verified to create collections",2)
    }
  }

  run_prod_overview(): void {
    this.modal.anythingtaker("prodview",(dom)=> {
      this.start_up_prod_view(dom)
    } , true)
  }

  start_up_prod_view(the_dom: HTMLDivElement):void{
    let price_tag = the_dom.querySelector("#price_field"),
    strap_tag = the_dom.querySelector("#strap_field"),
    case_tag = the_dom.querySelector("#case_field"),
    dial_tag = the_dom.querySelector("#dial_field"),
    sub_btn = the_dom.querySelector<HTMLButtonElement>("#create_btn"),
    inp_field = the_dom.querySelector<HTMLInputElement>("#inpfiled")

    if(price_tag && strap_tag && case_tag && dial_tag){
      price_tag.textContent = this.modal.currency_setter(this.total)
      strap_tag.textContent = this.modal.currency_setter(this.strapPrice)
      case_tag.textContent = this.modal.currency_setter(this.casePrice)
      dial_tag.textContent = this.modal.currency_setter(this.dialPrice)
    }

    if(sub_btn) sub_btn.onclick = () => {
      if(inp_field){
        if(inp_field.value.length < 1 || inp_field.value == " " || inp_field.value.trim().length < 1){
          this.take_and_send_sel_data("my_col_1" , the_dom)
        }else{
          this.take_and_send_sel_data(inp_field.value , the_dom)
        }
      }
    } 

    this.start_watch_animation(the_dom)
  }

  start_watch_animation(dom_model:HTMLDivElement){
    let imgs = dom_model.querySelectorAll<HTMLImageElement>("img")
    imgs.forEach((item) => {
      switch(item.className){
        case "pr_strap":
          if(this.oneStrap) item.src = this.oneStrap
          break;
        case "pr_case":
          if(this.oneCase) item.src = this.oneCase
          break;
        default:
          if(this.oneDial) item.src = this.oneDial
          break;
      }
    })
    setTimeout(() => {
      if(imgs){
        imgs.item(0).classList.add("active")
        imgs.item(0).addEventListener("transitionend",()=>{
          imgs.item(1).classList.add("active")
          imgs.item(1).addEventListener("transitionend",()=>{
            imgs.item(2).classList.add("active")
          },{once:true})
        } , {once:true})
      }
    }, 100);
  }

  take_and_send_sel_data (s:string , dom : HTMLDivElement):void{
    let d = new Date(),
    on_case = this.oneCase?.split("/"),
    on_dial = this.oneDial?.split("/"),
    on_strap = this.oneStrap?.split("/"),
    spinner = dom.querySelector<HTMLElement>(".fa-spinner"),
    button = dom.querySelector<HTMLButtonElement>("#create_btn"),
    msg: string = ""

    let data: Collection = {
      user: this.userData.user,
      name: s.replaceAll(" ","_"),
      date: `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`,
      price: this.total,
      parts: {
        case_img_name: on_case ? on_case[on_case.length - 1] : "--",
        dial_img_name: on_dial ? on_dial[on_dial.length - 1] : "--",
        strap_img_name: on_strap ? on_strap[on_strap.length - 1] : "--"
      }
    }

    spinner?.classList.remove("hide")
    button?.classList.add("hide")

    this.watchserveice.store_collection(data).subscribe((e: MyResponse) => {
      if(e.condition == 1){
        this.modal.endModal(()=>{
          this.modal.ondialog(`"${data.name}" collection was created successfully`,1)
          if(!this.collection_list)
            this.collection_list = [data]
          else
            this.collection_list.splice(0,0,data)
        })
      }else if(e.condition == 0){
        msg = "oops soory seems like there is an error, would you like to try again"
        this.modal.endModal(()=> this.modal.askquestion(msg, ()=> this.saveCombination()))
      }else{
        msg = "seems like you already have this type of collection already"
        this.modal.endModal(()=> this.modal.ondialog(msg,0))
      }
    }, (e) => {
      this.modal.endModal(()=>{
        this.modal.ondialog("seems like an error occured, pls try again later",0)
      })
    })
  }

  parts_img_set(part: string ,end_path: string):string{
    return `../../assets/watchparts/${part}/${end_path}`
  }

  get_collections_data():void{
    let msg: string = "Sorry, we failed to get your collections, would you like to try again?"
    this.watchserveice.get_collections(this.userData.user).subscribe((e:MyResponse) => {
      if(e.condition == 1){
        if(e.msg){
          let reve_data: Collection[] = JSON.parse(e.msg)
          this.collection_list = reve_data.reverse()
        } 
      }else{
        
      }
    },(e: any)=>{
      this.modal.askquestion(msg , ()=> this.get_collections_data())
    })
  }

  del_col(pos: number , collection: Collection){
    let msg = `are you sure you want to delete " #${collection.name.toUpperCase()} " collection?`
    this.modal.askquestion(msg,()=> {
      if(collection.id){
        this.watchserveice.del_our_collect(collection.id).subscribe((e) => {
          if(e.condition == 1)
            this.modal.ondialog(`" ${collection.name} " has been successfully deleted` , 1 , ()=> this.collection_list?.splice(pos,1))
          else{
            let msg = e.msg ? e.msg : "failed to delete collection"
            this.modal.ondialog(msg , 0)
          }
        } , (er) => {
          let ms = er.error ? "Server Error: " + er.error : "operation failed"
          this.modal.ondialog(ms , 0)
        })
      }
    })
  }
}