import { Component , OnInit} from '@angular/core';
import { ModalsServices } from './services/help.service';
import { UserCahedData } from './interfaces/user-cahed-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'build_ur_watch';
  kyc: boolean = localStorage.getItem("BUW_data") == null ? false : true
  nol = sessionStorage.getItem("BUW_session") == null ? false : true
  userdata !: UserCahedData
  see_view = false
  m_c = false

  constructor  (private modal : ModalsServices) {
    if(this.kyc){
      let data = localStorage.getItem("BUW_data")
      if(data == "new"){
        this.kyc = false
    }else{
        if(data) this.userdata = JSON.parse(data)
      }
    }else{
      localStorage.setItem("BUW_data","new")
    }
  }

  ngOnInit(): void {
    this.bubblefall()
  }

  open_m_com(eve: boolean){
    this.m_c = eve
  }

  loggedIn(event : boolean):void{
    this.nol = event
    if(this.see_view) this.see_view = false
    let usedata = localStorage.getItem("BUW_data")
    let session = sessionStorage.getItem("BUW_session")
    if(typeof usedata == "string" && usedata){
      this.userdata = JSON.parse(usedata)
      this.kyc = true
    }
    if(session == null) sessionStorage.setItem("BUW_session" , "logged_in")
  }
  know_customer(event : boolean):void{
    this.kyc = event
  } 

  bubblefall():void{
    let r = document.querySelector(".floatboxes") 
    if(r != null){
      for(let i = 0; i < 40; i++){
        let box = window.document.createElement("div")
        let w_h = this.modal.randomArrayWithRange(50,100)
        box.className = "tiny-box"
        box.style.animationDuration = this.modal.randomArrayWithRange(50,100) + "s"
        box.style.width = w_h + "px"
        box.style.height = w_h + "px"

        r.append(box)
      }
    }
  }
  change_to_Home ( eve : boolean) :void {
    this.see_view = eve
  }
  open_view(eve : boolean) : void{
    this.see_view = eve
  }











  bublewave():void{
    let parent = document.querySelector(".bubblepop")
    if(parent){
      for(let i = 0; i < 4; i++){
        let box = document.createElement("div")
        box.className = "box"
        box.innerHTML = `
          <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" id="blobSvg">
            <defs>
              <pattern id="pattern" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse" fill="#d1d8e0">
                <path d="M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z"></path>
              </pattern>
            </defs>
            <path fill="url(#pattern)" stroke-width="7px" stroke="#d1d8e0">
              <animate attributeName="d"
              dur="10000ms"
              repeatCount="indefinite"
              values="
              ${this.svg_animations(i)}
              "></animate>
            </path>
          </svg>
        `
        parent.append(box)
      }
      setInterval(()=>{
        parent?.querySelectorAll<HTMLDivElement>(".box").forEach(item=>{
          item.style.opacity = '.4'
          item.style.top = this.modal.randomArrayWithRange(30,70) + "%"
          item.style.left = this.modal.randomArrayWithRange(10,100) + "%"
        })
      },5000)
    }
  }
  svg_animations(index: number):string{
    let svg_patterns = [
      `
        M374,277Q344,304,334.5,342Q325,380,287.5,421.5Q250,463,204.5,435Q159,407,170.5,348Q182,289,128.5,269.5Q75,250,85.5,205.5Q96,161,145.5,157.5Q195,154,222.5,154Q250,154,307.5,102.5Q365,51,400,97Q435,143,419.5,196.5Q404,250,374,277Z;
        M373,282Q360,314,359,375.5Q358,437,304,436.5Q250,436,201,428Q152,420,164,356.5Q176,293,119,271.5Q62,250,118.5,228.5Q175,207,192.5,194Q210,181,230,161.5Q250,142,289.5,127.5Q329,113,335,155Q341,197,363.5,223.5Q386,250,373,282Z;
        M435.5,311.5Q463,373,386,362.5Q309,352,279.5,420Q250,488,216,427.5Q182,367,109.5,370Q37,373,73.5,311.5Q110,250,91,198.5Q72,147,134,151.5Q196,156,223,122.5Q250,89,311,63.5Q372,38,417,83Q462,128,435,189Q408,250,435.5,311.5Z;
        M374,277Q344,304,334.5,342Q325,380,287.5,421.5Q250,463,204.5,435Q159,407,170.5,348Q182,289,128.5,269.5Q75,250,85.5,205.5Q96,161,145.5,157.5Q195,154,222.5,154Q250,154,307.5,102.5Q365,51,400,97Q435,143,419.5,196.5Q404,250,374,277Z;
      `,
      `
        M373.5,273Q330,296,315,316Q300,336,275,413.5Q250,491,198.5,459.5Q147,428,142.5,371.5Q138,315,120.5,282.5Q103,250,108,210.5Q113,171,151,157.5Q189,144,219.5,94Q250,44,283.5,89Q317,134,374.5,139.5Q432,145,424.5,197.5Q417,250,373.5,273Z;
        M388.5,273Q329,296,317.5,322Q306,348,278,354Q250,360,190.5,408.5Q131,457,87,413Q43,369,74,309.5Q105,250,127,221Q149,192,143,123Q137,54,193.5,44Q250,34,305,47Q360,60,382,110.5Q404,161,426,205.5Q448,250,388.5,273Z;
        M395,297Q413,344,387,393.5Q361,443,305.5,425.5Q250,408,190.5,431.5Q131,455,155,373Q179,291,142.5,270.5Q106,250,80.5,193.5Q55,137,118.5,134Q182,131,216,116Q250,101,294,99.5Q338,98,392,117.5Q446,137,411.5,193.5Q377,250,395,297Z;
        M373.5,273Q330,296,315,316Q300,336,275,413.5Q250,491,198.5,459.5Q147,428,142.5,371.5Q138,315,120.5,282.5Q103,250,108,210.5Q113,171,151,157.5Q189,144,219.5,94Q250,44,283.5,89Q317,134,374.5,139.5Q432,145,424.5,197.5Q417,250,373.5,273Z;
      `,
      `
        M359.5,283Q365,316,328,318Q291,320,270.5,361Q250,402,204,406Q158,410,109,384.5Q60,359,39,304.5Q18,250,87.5,223Q157,196,146,123.5Q135,51,192.5,36.5Q250,22,283,79Q316,136,344.5,157.5Q373,179,363.5,214.5Q354,250,359.5,283Z;
        M386,290Q389,330,345,334Q301,338,275.5,355Q250,372,204.5,390Q159,408,169.5,349Q180,290,109,270Q38,250,59,201Q80,152,131,142Q182,132,216,127Q250,122,294,110Q338,98,328.5,154Q319,210,351,230Q383,250,386,290Z;
        M434.03214,291.94069Q395.79242,333.88138,383.32868,397.07251Q370.86493,460.26363,310.43246,434.08322Q250,407.90281,202.07413,411.83279Q154.14827,415.76277,111.27923,385.38798Q68.41018,355.0132,97.84102,302.5066Q127.27185,250,152.15324,229.14004Q177.03462,208.28008,166.41764,147.82208Q155.80065,87.36407,202.90033,60.53128Q250,33.69849,285.26688,80.40444Q320.53377,127.11039,353.24383,149.63344Q385.95389,172.1565,429.11287,211.07825Q472.27185,250,434.03214,291.94069Z;
        M359.5,283Q365,316,328,318Q291,320,270.5,361Q250,402,204,406Q158,410,109,384.5Q60,359,39,304.5Q18,250,87.5,223Q157,196,146,123.5Q135,51,192.5,36.5Q250,22,283,79Q316,136,344.5,157.5Q373,179,363.5,214.5Q354,250,359.5,283Z;
      `,
      `
        M415.5,275Q337,300,333.5,344.5Q330,389,290,435Q250,481,212.5,431Q175,381,145,354.5Q115,328,100,289Q85,250,124,225Q163,200,160.5,145.5Q158,91,204,125Q250,159,298.5,120.5Q347,82,374.5,122Q402,162,448,206Q494,250,415.5,275Z;
        M412,304Q437,358,369,348Q301,338,275.5,342Q250,346,213,362Q176,378,145,353Q114,328,143,289Q172,250,125.5,200.5Q79,151,142.5,163Q206,175,228,131.5Q250,88,311.5,62.5Q373,37,347.5,122.5Q322,208,354.5,229Q387,250,412,304Z;
        M403.00498,290.13268Q389.02656,330.26535,355.50747,352.12272Q321.98838,373.98008,285.99419,377.2305Q250,380.48091,208.87728,386.36151Q167.75456,392.24212,150.2471,354.87396Q132.73963,317.50581,93.90218,283.7529Q55.06473,250,94.01743,216.24129Q132.97013,182.48257,167.98589,175.36815Q203.00166,168.25373,226.50083,100.39222Q250,32.5307,302.87977,49.75705Q355.75954,66.9834,367.7388,121.00083Q379.71805,175.01826,398.35073,212.50913Q416.9834,250,403.00498,290.13268Z;
        M415.5,275Q337,300,333.5,344.5Q330,389,290,435Q250,481,212.5,431Q175,381,145,354.5Q115,328,100,289Q85,250,124,225Q163,200,160.5,145.5Q158,91,204,125Q250,159,298.5,120.5Q347,82,374.5,122Q402,162,448,206Q494,250,415.5,275Z;
      `
    ]

    return svg_patterns[index]
  }
}
