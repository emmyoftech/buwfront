import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ModalsServices } from '../services/help.service';
import { UserCahedData } from '../interfaces/user-cahed-data';
import { WatchpartsService } from '../services/watchparts.service';
import { Observable } from 'rxjs';
import { MyResponse } from '../interfaces/my-response';
import { Cred } from '../interfaces/cred';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  constructor(public helper: ModalsServices, private watch: WatchpartsService) {}
  @Input() parentData !: boolean
  @Input() k_y_c !: boolean
  @Input() userdata !: UserCahedData
  @Input() view !: boolean
  @Input() mob_com !: boolean

  @Output() childboolean_2: EventEmitter<boolean> = new EventEmitter()
  @Output() kyc_change: EventEmitter<boolean> = new EventEmitter()
  @Output() chnage_to_home : EventEmitter<boolean>= new EventEmitter()
  @Output() open_mobile_coll : EventEmitter<boolean> = new EventEmitter()


  color: { background: string } = { background: this.helper.randcolour() }


  change_to_home_meth ():void{
    this.chnage_to_home.emit(false)
  }

  log_u (){
    this.helper.askquestion("are you sure you want to logout?",()=> this.logoutUser())
  }

  open_m_c(){
    this.open_mobile_coll.emit(true)
  }

  open_profiler() {
    this.helper.anythingtaker("profile", (dom) => {
      let menu_btn = dom.querySelector("#menu_icon"),
        close_btn = dom.querySelector("#close_icon"),
        menu_hold = dom.querySelector(".menu"),
        logout_trigger = dom.querySelector("#logout"),
        backtriggerformenupanel = dom.querySelector("#back"),
        user_data: string | null = localStorage.getItem("BUW_data"),
        all_list = menu_hold?.querySelectorAll<HTMLLIElement>("li"),
        all_panel = dom.querySelector<HTMLDivElement>(".main-profile-container")?.querySelectorAll<HTMLDivElement>(".page")

      menu_btn?.addEventListener("click", () => {
        let nav_hold = menu_btn?.parentElement
        if(nav_hold) nav_hold.classList.add("hide")
        menu_hold?.classList.add("active")

        all_list?.forEach((item) => {
          item.addEventListener("click", () => {
            let nav_hold = menu_btn?.parentElement
            
            if(item.id == "back"){
              if(nav_hold) nav_hold.classList.remove("hide")
              return
            }else if(item.id == "logout"){
              if(nav_hold) nav_hold.classList.remove("hide")
              return
            }else{
              if(nav_hold) nav_hold.classList.remove("hide")
              all_panel?.forEach((sub_item) => {
                if (item.dataset["page"] == sub_item.dataset['page']) {
                  sub_item.classList.remove("hide")
                  switch(sub_item.dataset['page']){
                    case "dashboard": this.set_up_user_dashbord(dom)
                    break;
                    case "edit": 
                      if(user_data) this.set_up_edit_panel(user_data ,dom)
                    break
                    case "verify": if(user_data) this.setup_email_verification(dom , user_data)
                    break
                    default : alert("me")
                    break
                  }
                } else {
                  sub_item.classList.add("hide")
                }
              })

            }
            menu_hold?.classList.remove("active")
          })
        })

        all_panel?.forEach((item) => {
          if (item.classList.contains("hide") != true) {
            all_list?.forEach((item_sub) => {
              if (item_sub.dataset['page'] == item.dataset['page']) {
                item_sub.classList.add("hide")
              } else {
                item_sub.classList.remove("hide")
              }
            })
          }
        })

      })

      close_btn?.addEventListener("click", () => {
        this.helper.endModal()
      })

      logout_trigger?.addEventListener("click", () => this.logoutUser())

      backtriggerformenupanel?.addEventListener("click", () => {
        menu_hold?.classList.remove("active")
      })

      this.set_up_user_dashbord(dom)
      if (user_data != null) {
        this.set_up_edit_panel(user_data, dom)
        this.setup_email_verification(dom , user_data)
      }
      
      this.setup_left_bar(dom)
    })
  }

  sendtoPAR(): void {
    if (localStorage.getItem("BUW_data") != null)
      this.childboolean_2.emit(false)
    this.kyc_change.emit(true)
  }
  signupUser() {
    this.helper.openForm("signup", () => {
      this.childboolean_2.emit(true)
      this.kyc_change.emit(true)
    })
  }

  loginuser() {
    let logged_in = sessionStorage.getItem("BUW_session")
    if (logged_in != null) return this.childboolean_2.emit(true)
    this.helper.openForm("login", () => {
      this.childboolean_2.emit(true)
    })
  }

  returnfirststring(data: string): string {
    return data.slice(0, 1).toUpperCase()
  }

  set_up_user_dashbord(data: HTMLDivElement) {
    let user_data = localStorage.getItem("BUW_data")
    if (user_data == null) return alert("no user data")

    let stored_data: UserCahedData = JSON.parse(user_data),
      user_label_field = data.querySelector<HTMLParagraphElement>("#user_label"),
      user_name_field = data.querySelector("#user_name"),
      verification_field = data.querySelector("#verification")

    if (!user_label_field || !user_name_field || !verification_field) return alert("dom field failed")
    user_label_field.textContent = this.returnfirststring(stored_data.user)
    user_label_field.style.backgroundColor = this.color.background
    user_name_field.textContent = stored_data.user
    if (stored_data.verification == false)
      verification_field.innerHTML = "not verified"
    else
      verification_field.innerHTML = `<i class="fa-solid fa-ribbon"></i> verified`
  }
  set_up_edit_panel(user: string, maindocument: HTMLDivElement) {
    let main_edit_model = maindocument.querySelector<HTMLDivElement>(".edit_profile"),
      pw_form = main_edit_model?.querySelector<HTMLFormElement>(".pw_change"),
      us_form = main_edit_model?.querySelector<HTMLFormElement>(".us-name_change"),
      pw_cl_btn = main_edit_model?.querySelector<HTMLLIElement>("#pw_panel"),
      us_cl_btn = main_edit_model?.querySelector<HTMLLIElement>("#us_panel"),
      parsed_data: UserCahedData = JSON.parse(user),
      titletag = main_edit_model?.querySelector("#edit_title"),
      allinputs = main_edit_model?.querySelectorAll<HTMLInputElement>("input"),
      con_pass_btn = main_edit_model?.querySelector<HTMLButtonElement>(".spec_btn")
      con_pass_btn?.addEventListener("click", con_pass)
      let profile_con = maindocument.querySelector<HTMLSpanElement>(".profile_controllers")
      let err = (inp: HTMLInputElement, ms: string, s_o?: boolean) => this.err_msg(inp, ms, s_o)
      let valuserfunction = (u: Cred) => this.apicall(u)
      let sentout = (m: string) => this.sendoutuser(m)
      let server_err_handler = (m: string, b: boolean) => this.end_opertion_and_say(m, b)
      let val = (inp: HTMLInputElement, msg: HTMLParagraphElement) => this.helper.pass_validator(inp, msg)
      let sub_to_server = (eve: SubmitEvent) => this.sendtoserver(eve, parsed_data.user)
      let frm_to_sub_val_open = (frm: HTMLFormElement) => this.val_to_open_sub_btn(frm)
      let compObj = this

    pw_form?.classList.add("hide")
    us_form?.classList.add("hide")
    main_edit_model?.querySelector("#model_changer_holder")?.classList.remove("hide")
    allinputs?.forEach(item => {
      item.addEventListener("input", change_verify)
      item.addEventListener("blur", blur_verify)
    })

    if (pw_form != null && us_form != null) {
      pw_form.addEventListener("submit", sub_to_server)
      us_form.addEventListener("submit", sub_to_server)
    }
    if (pw_cl_btn != null && us_cl_btn != null) {
      pw_cl_btn.addEventListener("click", change_panel)
      us_cl_btn.addEventListener("click", change_panel)
    }
    function change_panel(eve: MouseEvent){
      let m = eve.target as HTMLLIElement,
        parent_of_m = m.parentElement,
        back_btn: HTMLElement | null | undefined = profile_con?.querySelector("#bck_btn")
      if (m.id == "us_panel") {
        if (titletag != null) titletag.textContent = "change username"
        pw_form?.classList.add("hide")
        us_form?.classList.remove("hide")
        if (us_form) set_up_us(parsed_data.user, us_form)
      } else {
        if (titletag != null) titletag.textContent = "change password"
        us_form?.classList.add("hide")
        pw_form?.classList.remove("hide")
      }
      if (back_btn) back_btn.onclick = () => {
        let f = m.id == "us_panel" ? us_form : pw_form
        let h = f as HTMLElement
        if (parent_of_m) compObj.go_back(h, parent_of_m, () => {
          if (profile_con) compObj.back_btn_swap(profile_con)
          if (f) compObj.return_and_reset(f)
        })
      }
      if (profile_con) compObj.back_btn_swap(profile_con)
      parent_of_m?.classList.add("hide")
    }

    function blur_verify(eve: FocusEvent) {
      let eventtarget = eve.target as HTMLInputElement
      if (eventtarget.value.length < 1) {
        err(eventtarget, "this field cannot be empty", true)
      }
    }

    function change_verify(eve: Event) {
      let eventtarget = eve.target as HTMLInputElement,
        parent = eventtarget.closest("label"),
        msg_field = parent?.querySelector<HTMLParagraphElement>(".inp_msg"),
        formhandler = parent?.closest<HTMLFormElement>("form")


      if (eventtarget.type == "password") {
        if (eventtarget.id == "ol-con-pass") {
          if (msg_field) {
            if (eventtarget.value.length < 1) {
              err(eventtarget, "this field cannot be empty")
            } else {
              msg_field.textContent = null
              eventtarget.classList.remove("err")
            }
          }
        } else if (eventtarget.placeholder.includes("Confirm") != true) {
          if (eventtarget.value.length < 1) {
            err(eventtarget, "this field cannot be empty")
          } else {
            if (msg_field) val(eventtarget, msg_field)
            eventtarget.classList.remove("err")
          }
        } else {
          eventtarget.classList.remove("err")
        }
      }

      if (formhandler) frm_to_sub_val_open(formhandler)
    }

    function con_pass(eve: MouseEvent) {
      eve.preventDefault()
      let html_btn = eve.target as HTMLButtonElement,
        input_to_valid = allinputs?.item(0),
        spinner = html_btn.querySelector("i")

      if (input_to_valid != null) {
        let value_of_input = input_to_valid.value
        if (value_of_input.length < 1) {
          err(input_to_valid, "this field cannot be empty", true)
        } else if (value_of_input.length > 0 && value_of_input.length < 6) {
          err(input_to_valid, "invalid passsword")
        } else {
          spinner?.classList.remove("hide")
          input_to_valid.classList.add("disabled")
          let m: Cred = {
            username: parsed_data.user,
            password: value_of_input
          }
          valuserfunction(m).subscribe({
            next: (resolve) => {
              spinner?.classList.add("hide")
              input_to_valid?.classList.remove("disabled")

              switch (resolve.condition) {
                case 1: pass_success_pw()
                  break;
                case 2:
                  if (input_to_valid) err(input_to_valid, "invalid password", true)
                  break
                default:
                  sentout(`the owner of this account has either been removed from our database or you are an imposter`)
                  break
              }
            },
            error: (err: any) => {
              spinner?.classList.add("hide")
              input_to_valid?.classList.remove("disabled")
              server_err_handler("some error occured from the server", false)
            }
          })
        }
      }
    }

    function pass_success_pw() {
      let all_labels = pw_form?.querySelectorAll<HTMLLabelElement>("label")
      let sub_btn = pw_form?.querySelector<HTMLInputElement>("input[type='submit']")
      if (all_labels) {
        all_labels.forEach((item => {
          if (item.classList.contains("disabled")) {
            item.classList.remove("disabled")
          } else {
            item.classList.add("hide")
          }
        }))
      } else {
        alert("som thing is wrong")
      }
    }

    function set_up_us(ol_name: string, frm: HTMLFormElement) {
      let name_field = frm.querySelector<HTMLParagraphElement>("#old_user_name")
      let user_dets = localStorage.getItem("BUW_data")
      if (user_dets) {
        let p_data: UserCahedData = JSON.parse(user_dets)
        if (p_data.user == ol_name) {
          if (name_field) name_field.textContent = ol_name
        } else {
          if (name_field) name_field.textContent = p_data.user
        }
      } else {
        if (name_field) name_field.textContent = ol_name
      }
    }
  }
  setup_email_verification(n: HTMLDivElement , s:string) {
    let parsed_user_data : UserCahedData = JSON.parse(s)
    let container = n.querySelector<HTMLDivElement>(".verify"),
      classobj = this,
      form = container?.querySelector<HTMLFormElement>("form"),
      input = form?.querySelector<HTMLInputElement>("input[type='email']"),
      icon_holder = form?.closest(".profile")?.querySelector<HTMLSpanElement>(".profile_controllers")
      let all_dom = form?.closest(".floater")?.querySelector<HTMLSpanElement>(".loader_msg"),
      knownUserDom = container?.querySelector(".user_known"),
      mot_known_user = container?.querySelector(".verify_user"),
      switc_btn = knownUserDom?.querySelector<HTMLButtonElement>("button"),
      setter_of_ver = container?.querySelector("#if_veri_or_not"),
      tit_Char = container?.querySelector<HTMLParagraphElement>(".tit_letter"),
      user_holder = container?.querySelector<HTMLSpanElement>("#us_fielder")

      if(tit_Char && user_holder){
        tit_Char.style.background = classobj.color.background
        tit_Char.textContent = classobj.returnfirststring(parsed_user_data.user)
        user_holder.textContent = parsed_user_data.user
      } 

      

      switc_btn?.addEventListener("click",switch_k_uk)


    if(parsed_user_data.verification){
      switc_btn?.classList.add("hide")
      setter_of_ver?.classList.add("verified")
      addEmail()
    }else{
      knownUserDom?.classList.remove("hide")
      mot_known_user?.classList.add("hide")
    }

    function switch_k_uk (){
      knownUserDom?.classList.add("hide")
      mot_known_user?.classList.remove("hide")
    }

    function addEmail (){
      let emailDOm = knownUserDom?.querySelector('#us_email')
      classobj.watch.get_email(parsed_user_data.user).subscribe({
        next: (e) => {
          if(e.condition == 1){
            if(e.msg) setmail(e.msg)
          }
        }
      })

      function setmail (e: string){
        if(emailDOm){
          emailDOm.classList.remove("hide")
          let span_field = emailDOm.querySelector("span")
          if(span_field) span_field.textContent = e
        }
      }
    }


    input?.addEventListener("input", (e) => {
      let inputDOM = e.target as HTMLInputElement,
        in_value = inputDOM.value,
        msg_field = inputDOM.parentElement?.querySelector<HTMLParagraphElement>(".inp_msg"),
        sub_field = form?.querySelector<HTMLInputElement>("input[type='submit'")

      if (msg_field && in_value && sub_field) {
        if (inputDOM.type == "number") {
          if (in_value.length !== 6) {
            inputDOM.classList.add("err")
            msg_field.textContent = "enter valid code"
            sub_field.classList.add("disabled")
          } else {
            inputDOM.classList.remove("err")
            msg_field.textContent = null
            sub_field.classList.remove("disabled")
          }
        } else {
          if (in_value.length < 4 || in_value.includes("@") != true || in_value.charAt(0) == "@" || in_value.charAt(in_value.length - 1) == "@") {
            inputDOM.classList.add("err")
            msg_field.textContent = "enter a valid email"
            sub_field.classList.add("disabled")
          } else {
            inputDOM.classList.remove("err")
            msg_field.textContent = null
            sub_field.classList.remove("disabled")
          }
        }
      }
    })

    if (form) form.onsubmit = (e) => {
      e.preventDefault()
      form?.classList.add("disabled")
      if (all_dom) classobj.load_to_spin(all_dom, "load")
      let val = input?.value
      if (form?.classList.contains("otp_ver")) {
        let code_data = localStorage.getItem("code_mail")
        if (code_data) {
          let parsed = code_data.split(",")
          let code = parsed[0],
            mail = parsed[1]

          if (code && val && all_dom) {
            if (code == val) {
              localStorage.removeItem("code_mail")
              classobj.watch.set_verification(classobj.userdata.user, mail).subscribe({
                next: (res) => {
                  if (all_dom) {
                    if (res.condition == 1) {
                      classobj.load_to_spin(all_dom, "stop")
                      let par_par = form?.closest<HTMLDivElement>(".profile")
                      if (par_par) classobj.show_ver_succ_go_to_dash(par_par, this.userdata.user)
                      form?.reset()
                      form?.classList.remove("disabled")
                    } else {
                      let msg = "this email has been uesd by another user, please try another email"
                      classobj.load_to_spin(all_dom, "s_w_m", {
                        m: msg, f: () => {
                          go_to_otp_or_ver("ver")
                        }
                      })
                      form?.classList.remove("disabled")
                    }
                  }
                },
                error: (err: any) => {
                  form?.classList.remove("disabled")
                  let msg = err.error ? err.error : "verification failed, try again later"
                  if (all_dom) classobj.load_to_spin(all_dom, "s_w_m", {
                    m: msg, f() {
                      go_to_otp_or_ver("ver")
                    },
                  })
                }
              })
            } else {
              form?.classList.remove("disabled")
              classobj.load_to_spin(all_dom, "s_w_m", { m: "incorrect code" })
            }
          }
        }
      } else {
        if (val) {
          classobj.watch.verify_email(val).subscribe({
            next: (res) => {
              if (res.condition == 1) {
                form?.classList.remove("disabled")
                form?.reset()
                if (res.msg) {
                  localStorage.setItem("code_mail", `${res.msg},${val}`)
                }
                if (all_dom) classobj.load_to_spin(all_dom, "stop")
                go_to_otp_or_ver("otp")
                icon_holder?.classList.add("hide")
              } else {
                form?.classList.remove("disabled")
                form?.reset()
                
                if (all_dom) classobj.load_to_spin(all_dom, "s_w_m", { m: res.condition == 0 ? "Error while sending email, please try another email": "this email has already been used by another user, pls try another email" })
              }
            },
            error: (err: any) => {
              form?.classList.remove("disabled")
              form?.reset()
              if (all_dom) classobj.load_to_spin(all_dom, "s_w_m", { m: "email verification failed" })
            }
          })
        }
      }

      function go_to_otp_or_ver(where: string) {
        let sub_btn = form?.querySelector<HTMLInputElement>("input[type='submit']")
        let pre_msg_dom = form?.parentElement?.querySelector<HTMLParagraphElement>(".ntd_msg"),
          otp_msg_dom = form?.parentElement?.querySelector<HTMLHeadElement>(".otp_msg"),
          bck_btn = form?.querySelector<HTMLButtonElement>(".norm_btn"),
          icon_hld = form?.closest(".profile")?.querySelector<HTMLSpanElement>(".profile_controllers")
        if (where == "otp") {
          if (pre_msg_dom && otp_msg_dom && bck_btn) {
            pre_msg_dom.classList.add("hide")
            otp_msg_dom.classList.remove("hide")
            bck_btn.classList.remove("hide")
            bck_btn.onclick = () => {
              go_to_otp_or_ver("ver")
              setTimeout(() => {
                if (all_dom) classobj.load_to_spin(all_dom, "stop")
              }, 10);
            }
          }
        } else {
          if (pre_msg_dom && otp_msg_dom && bck_btn) {
            pre_msg_dom.classList.remove("hide")
            otp_msg_dom.classList.add("hide")
            bck_btn.classList.add("hide")
            icon_hld?.classList.remove("hide")
            setTimeout(()=> form?.classList.remove("disabled") , 200)
          }
        }
        if (sub_btn) sub_btn.classList.add("disabled")
        morph_frm_to_otp_ver(where)
        form?.reset()
      }
    }

    function morph_frm_to_otp_ver(wh: string) {
      if (form && input) {
        if (wh == "otp") {
          form.classList.add("otp_ver")
          input.placeholder = "Enter verification code..."
          input.type = "number"
        } else {
          form.classList.remove("otp_ver")
          input.placeholder = "Enter your email..."
          input.type = "email"
        }
      }
    }
  }

  err_msg(inp_doc: HTMLInputElement, msg: string, switchoff?: boolean) {
    let msgbox = inp_doc.closest("label")?.querySelector<HTMLParagraphElement>(".inp_msg")
    if (switchoff && msgbox != null) setTimeout(() => {
      if (msgbox != null) msgbox.textContent = ""
      inp_doc.classList.remove("err")
    }, 2000)
    if (msgbox != null) {
      if (msgbox.textContent == null) return alert("some prob at nav.ts 180")
      msgbox.textContent = msg
      inp_doc.classList.add("err")
    }
  }

  logoutUser() {
    this.helper.endModal(() => {
      this.childboolean_2.emit(false)
      sessionStorage.removeItem("BUW_session")
    })
  }

  sendoutuser(msg: string) {
    this.helper.endModal(() => {
      this.helper.ondialog(msg, 0,)
    })
    this.childboolean_2.emit(false)
  }

  sendtoserver(eve: SubmitEvent, user: string) {
    eve.preventDefault()
    let componentObject = this
    let whijchform = eve.target as HTMLFormElement,
      inputs = whijchform.querySelectorAll("input")
    let loader_par = whijchform.closest<HTMLDivElement>(".main-profile-container"),
      loader = loader_par?.querySelector<HTMLDivElement>(".loader_msg")

    if (whijchform.classList.contains("pw_change")) {
      pwformfunc()
    } else {
      usformfunc()
    }

    function pwformfunc() {
      let pass_field = inputs.item(1).value

      if (loader) componentObject.load_to_spin(loader, "load");

      if (pass_field) {
        componentObject.watch.change_password({ username: user, password: pass_field }).subscribe({
          next: (resolve) => {
            if (resolve.condition == 1) {
              let m_s_g = "password changed successfully"

              if (loader) componentObject.load_to_spin(loader, "s_w_m", {
                m: m_s_g, s: true, f: () => {
                  componentObject.return_and_reset(whijchform)
                  let con_control = loader_par?.parentElement?.querySelector<HTMLSpanElement>(".profile_controllers")
                  if (con_control) componentObject.back_btn_swap(con_control)
                }
              })
            } else {
              if (resolve.msg && loader) componentObject.load_to_spin(loader, "s_w_m", { m: resolve.msg, s: false })
              else {
                componentObject.end_opertion_and_say("developer error", false)
              }
            }
          }, error: (err) => {
            let message: string = err.error ? err.error : `server error (${err.status})`
            componentObject.end_opertion_and_say(message, false)
          }
        })
      }
    }

    function usformfunc() {
      if (loader) componentObject.load_to_spin(loader, "load")
      let inp = inputs.item(0)

      componentObject.watch.change_username({ old_user: user, new_user: inp.value }).subscribe({
        next: (resolve) => {
          if (loader) {
            if (resolve.condition == 1) {
              componentObject.load_to_spin(loader, "s_w_m", {
                m: `your username has successfully been updated`,
                s: true,
                f: () => {
                  let loc = localStorage.getItem("BUW_data")
                  let con_control = loader_par?.parentElement?.querySelector<HTMLSpanElement>(".profile_controllers")
                  if (loc) {
                    let user_d: UserCahedData = JSON.parse(loc)
                    user_d.user = inp.value
                    localStorage.setItem("BUW_data", JSON.stringify(user_d))
                  }
                  componentObject.userdata.user = inp.value
                  componentObject.return_and_reset(whijchform)
                  if (con_control) componentObject.back_btn_swap(con_control)
                }
              })
            } else {
              if (resolve.msg) componentObject.end_opertion_and_say(resolve.msg, false)
            }
          }

        },
        error: (err: any) => {
          componentObject.end_opertion_and_say(err.error, false)
        }
      })
    }
  }

  end_opertion_and_say(m: string, is_good: boolean) {
    let situation: number = is_good ? 1 : 0
    this.helper.endModal(() => this.helper.ondialog(m, situation))
  }

  return_and_reset(f: HTMLFormElement) {
    let p = f.parentElement,
      basepage = p?.querySelector<HTMLUListElement>("#model_changer_holder"),
      title_field = p?.querySelector("#edit_title")
    if (basepage != null) basepage.classList.remove("hide")
    f.classList.add("hide")

    reset()

    function reset() {
      let inps: NodeListOf<HTMLInputElement> = f.querySelectorAll("input")
      if (f.className.includes("pw_change")) {
        let labs: NodeListOf<HTMLLabelElement> = f.querySelectorAll("label")
        for (let i = 0; i < labs.length; i++) {
          if (i < 1) {
            labs[i].classList.remove("hide")
          } else {
            labs[i].classList.add("disabled")
          }
        }
      }
      inps.item(inps.length - 1).classList.add("disabled")
      if (title_field) title_field.textContent = null
      f.reset()
    }
  }

  back_btn_swap(ele: HTMLSpanElement) {
    let s_i: NodeListOf<HTMLElement> = ele.querySelectorAll("i"),
      last_i = s_i.item(s_i.length - 1)
    if (last_i.classList.contains("hide")) {
      for_two("hide")
      last_i.classList.remove("hide")
    } else {
      for_two("show")
      last_i.classList.add("hide")
    }

    function for_two(s: string) {
      for (let i = 0; i < s_i.length; i++) {
        if (i < 2 && s == "hide") {
          s_i.item(i).classList.add("hide")
        } else if (i < 2 && s == "show") {
          s_i.item(i).classList.remove("hide")
        }
      }
    }
  }

  go_back(from: HTMLElement, to: HTMLElement, do_if_added?: () => void) {
    from.classList.add("hide")
    to.classList.remove("hide")
    if (do_if_added) do_if_added()
  }

  apicall(user: Cred): Observable<MyResponse> {
    return this.watch.get_if_pass_is_valid(user)
  }

  val_to_open_sub_btn(frm: HTMLFormElement) {
    let sub = frm.querySelector<HTMLInputElement>("input[type='submit']")
    if (frm.classList.contains("pw_change")) {
      let labels = frm.querySelectorAll<HTMLLabelElement>("label")
      if (labels.item(0).classList.contains("hide")) {
        let label_1_msg_box = labels.item(1).querySelector<HTMLParagraphElement>(".inp_msg"),
          last_lab_inp_value = labels.item(2).querySelector<HTMLInputElement>("input"),
          password_inp_field = labels.item(1).querySelector<HTMLInputElement>("input")

        if (label_1_msg_box && last_lab_inp_value && password_inp_field) {
          if (label_1_msg_box.textContent == "strong" && last_lab_inp_value.value === password_inp_field.value && password_inp_field.value.length > 5) {
            sub?.classList.remove("disabled")
          } else {
            sub?.classList.add("disabled")
          }
        }
      }
    } else {
      let inp = frm.querySelector<HTMLInputElement>("input[type='text']")
      if (inp) {
        if (inp.value.length < 3 || inp.value.length > 10) {
          sub?.classList.add("disabled")
        } else {
          sub?.classList.remove("disabled")
        }
      }
    }
  }
  load_to_spin(loadcon: HTMLSpanElement, to_do: string, swm_arg?: { m?: string, s?: boolean, f?: () => void }) {
    if (loadcon.classList.contains("loader_msg") != true) return alert("not the right container")
    let p_tag = loadcon.querySelector<HTMLParagraphElement>("p"),
      spinner = loadcon.querySelector<HTMLElement>("i")

    switch (to_do) {
      case "load": load()
        break
      case "stop": stop()
        break
      case "s_w_m": stop_with_message()
        break;
      default: alert("loader error")
    }

    function stop() {
      spinner?.classList.add("hide")
      loadcon.classList.add("hide")
      p_tag?.classList.add("hide")
      if (p_tag) p_tag.textContent = null
      if (swm_arg && swm_arg.f) swm_arg.f()
    }
    function load() {
      if (loadcon.classList.contains("hide")) {
        loadcon.classList.remove("hide")
        p_tag?.classList.add("hide")
        spinner?.classList.remove("hide")
      } else {
        p_tag?.classList.add("hide")
        spinner?.classList.remove("hide")
      }
    }
    function stop_with_message() {
      if (swm_arg) {
        spinner?.classList.add("hide")
        p_tag?.classList.remove("hide")

        if (swm_arg.m) {
          if (!p_tag) {
            console.error("dom is missing")
          } else {
            let cl = swm_arg.s ? "succ" : "err"
            p_tag.textContent = swm_arg.m
            p_tag.classList.add(cl)
          }
        }
        setTimeout(() => {
          stop()
        }, 3000);
      } else {
        console.error("nothing will run without an 'swm_arg' object")
      }
    }
  }
  show_ver_succ_go_to_dash(dom: HTMLDivElement, username: string) {
    if (dom.className != "profile") return alert("wrong dom")
    let succ_page = dom.querySelector<HTMLDivElement>(".veri_succ"),
      succ_logo = succ_page?.querySelector<HTMLElement>("i"),
      succ_name_tag = succ_page?.querySelector<HTMLSpanElement>("span"),
      comp_obj: NavComponent = this,
      nav = dom.querySelector<HTMLSpanElement>(".profile_controllers"),
      pages: NodeListOf<HTMLDivElement> = dom.querySelectorAll<HTMLDivElement>(".page")

    succ_page?.classList.add("active")
    succ_logo?.classList.add("active")
    if (succ_name_tag) succ_name_tag.textContent = username
    succ_logo?.addEventListener("transitionend", set_ver, { once: true })
    setTimeout(() => {
      succ_logo?.classList.remove("active")
      succ_logo?.addEventListener("transitionend", () => succ_page?.classList.remove("active"), { once: true })
    }, 2000);
    function set_ver() {
      let m_data = localStorage.getItem("BUW_data")
      if (m_data) {
        let j_data: UserCahedData = JSON.parse(m_data)
        j_data.verification = true
        localStorage.setItem("BUW_data", JSON.stringify(j_data))
        comp_obj.userdata.verification = true
      }
      comp_obj.set_up_user_dashbord(dom)
      nav?.classList.remove("hide")
      pages.forEach((item => {
        if(item.dataset["page"] == "dashboard"){
          item.classList.remove("hide")
        }else{
          item.classList.add("hide")
        }
      }))
    }
  }

  setup_left_bar (home_dom : HTMLDivElement){
    let all_left_lists_holder = home_dom.querySelector<HTMLDivElement>(".left"),
    all_left_lists = all_left_lists_holder?.querySelectorAll<HTMLLIElement>("li"),
    all_pages = home_dom?.querySelectorAll<HTMLDivElement>(".page"),
    classobj = this
    let data = localStorage.getItem("BUW_data")

    
    if(all_left_lists && all_pages){
      all_left_lists.forEach((item) => {
        item.onclick = () => {
          all_left_lists?.forEach(item => item.classList.remove("active"))
          item.classList.add("active")
          if(item.dataset['page'])
            set_page(item.dataset['page'])
          else
            this.logoutUser()
        }
      })
    }

    function set_page (pg_name : string) {
      all_pages?.forEach(item => {
        item.classList.add("hide")
        if(item.dataset['page'] == pg_name) item.classList.remove("hide")
      })
      switch(pg_name){
        case "dashboard": classobj.set_up_user_dashbord(home_dom)
        break;
        case "edit": 
          if(data) classobj.set_up_edit_panel(data , home_dom)
        break
        case "verify": if(data) classobj.setup_email_verification(home_dom , data)
        break
        default : alert("me")
        break
      }
    }
  }

  open_hamburger (){
    let btn_action = ( e : MouseEvent ) => {
      let btn = e.target as HTMLButtonElement
      if(btn.id == "log")
        this.loginuser()
      else
        this.signupUser()
    }

    this.helper.hamburger().querySelectorAll("button").forEach((item) => item.onclick = btn_action)
  }
}