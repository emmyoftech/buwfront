import { Component, EventEmitter, Output , Input} from '@angular/core';
import { ModalsServices } from '../services/help.service';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})
export class FrontpageComponent{
  constructor (
    private modal: ModalsServices){
    }
  @Input() k_y_c !: boolean ;
  @Output() childboolean : EventEmitter<boolean> = new EventEmitter()
  @Output() op_view : EventEmitter<boolean> = new EventEmitter()

  current_year = new Date().getFullYear()
  sendtoPar(){
    if(sessionStorage.getItem("BUW_session")  != null){
      this.childboolean.emit(true)
    }else if(this.k_y_c){
      this.modal.openForm("login",()=>{
        this.childboolean.emit(true)
      })
    }else{
      this.modal.openForm("signup",()=>{
        this.childboolean.emit(true)
      })
    }
  }

op_viewer (): void{
  this.op_view.emit(true)
}
}
