import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalsServices } from '../services/help.service';
import { WatchpartsService } from '../services/watchparts.service';
import { UserCahedData } from '../interfaces/user-cahed-data';
import { Collection } from '../interfaces/collection';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit{
  constructor (private modal: ModalsServices , private api_calls : WatchpartsService){}
  
  ngOnInit(): void {
    if(window.innerWidth > 440){
      this.is_mobile = false
    }else{
      this.is_mobile = true
    }

    this.get_collections()
  }
  
  //INPUTSSSSSS 
  @Input() userData !: UserCahedData

  // OUTPUTSSSS
  @Output() ch_to_hm : EventEmitter<boolean> = new EventEmitter()
  @Output() signup : EventEmitter<boolean> = new EventEmitter()
  @Output() login : EventEmitter<boolean> = new EventEmitter()

  //DECLARATIONSSSS
  personal_colls !: Collection[] 
  all_collection !: Collection[]
  is_mobile : boolean = false
  if_per_colls_gr_five = false
  num_of_per_colls : number = 0
  loading = true

  // METHODSSSSS

  get_collections ():void{
    this.api_calls.get_all_coll().subscribe((e) => {
        e.forEach((item) => {
          item.parts.case_img_name = environment.BASE_URL.concat(`case/${item.parts.case_img_name}`)
          item.parts.dial_img_name = environment.BASE_URL.concat(`dial/${item.parts.dial_img_name}`)
          item.parts.strap_img_name = environment.BASE_URL.concat(`strap/${item.parts.strap_img_name}`)
          item.name = st(item.name)

          function st (nm: string): string {
            if(nm.length > 10) nm = nm.slice(0, 10).concat("...")
            
            return nm
          }
        })
        if(this.userData){
          let per_coll = e.filter((item) => item.user == this.userData.user)
          if(per_coll.length > 0){
            this.personal_colls = per_coll.reverse()
            this.num_of_per_colls = per_coll.length
            if(per_coll.length > 5){
              this.if_per_colls_gr_five = true
              this.personal_colls = per_coll.slice(0 , 4)
            }
          }
        }

      if(e.length > 0){
        this.all_collection = e
      }
      this.loading = false
    } , (e) => {
      if(e.status != 303){
        let msg = e.error ? e.error : "operation has failed"
        this.modal.ondialog(msg , 0 ,()=> {
          this.ch_to_hm.emit(false)
        })
      }else{
        this.modal.askquestion(e.error , ()=> {
          this.log_user()
        })
        this.ch_to_hm.emit(false)
      }
    })
  }

  log_user ():void {
    if(this.userData.user){
      this.modal.openForm("login" , () => this.login.emit(true))
    }else{
      this.modal.openForm("signup" , () => this.signup.emit(true))
    }
  }
}
