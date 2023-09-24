import { Injectable } from "@angular/core";
import { WatchpartsService } from "./watchparts.service";
import { SignupLoginModel } from "../interfaces/signup-login-model";
import { UserCahedData } from "../interfaces/user-cahed-data";
import { retryWhen } from "rxjs";

@Injectable({
    providedIn : "root"
})

export class ModalsServices {
    constructor(private watch: WatchpartsService){}
    
    private newdev: HTMLDivElement = document.createElement('div')

    private title : string | undefined;

    private inHtml : string = "";

    private stopper : boolean = false

    private class_state : string | undefined;

    private strater (): void{
        this.newdev.className = "floater"
        this.newdev.innerHTML = `
            <section class="float-box ${this.class_state == undefined ? "" : this.class_state}">
                <p class="endModal hide" title="close"><i class="fa-solid fa-circle-xmark"></i></p>
                <h2 class="${this.title == undefined ? "hide" : ""}" >${this.title}</h2>
                ${this.inHtml}
            </section>
        `
        document.body.append(this.newdev)
        this.newdev.classList.add("activate")
        setTimeout(()=>{
            this.newdev.querySelector(".float-box")?.classList.add("activate")
            let all_ins: NodeListOf<HTMLInputElement> = this.newdev.querySelectorAll("input")
            all_ins.forEach((item => {
                if(item.type == "password"){
                    let parent = item.parentElement
                    if(parent != null){
                        let clickicon = document.createElement("i")
                        clickicon.className = "fa-solid fa-eye"
                        parent.appendChild(clickicon)
                        clickicon.addEventListener("click",eyetoggle)
                    }
                }

                function eyetoggle(e: MouseEvent){
                    let con : Element = e.target as Element
                    if(item.value.length > 0)
                    if(item.type == "password"){
                        item.type = "text"
                        con.className = "fa-solid fa-eye-slash"
                    }else{
                        item.type = "password"
                        con.className = "fa-solid fa-eye"
                    }
                }
            }))
        },300)
        let cls_btn = this.newdev.querySelector<HTMLParagraphElement>(".endModal")
        if(cls_btn) cls_btn.onclick = ()=> this.endModal()
    }

    ondialog (message : string , state : number, run?: ()=> void): void {
        this.title = state == 1 ? "success" : "error"
        this.class_state = this.title
        this.inHtml = `
            <p class="dialog_msg">${message}</p>
            <button class="dialog_btn">ok</button>
        `
        this.strater()
        this.newdev.querySelector(".dialog_btn")?.addEventListener("click",()=>{
            this.endModal(()=>{
                if(run) run()
            })
        })
    }

    openForm(state : string, run?: ()=> void | undefined ):void{
        if(state == "login" || state == "signup"){
            this.class_state = "form"
            this.title = state 
            let sub_html = state == "login" ? "" : `<label>
                                                        <input type="password" required id="n_w" placeholder="Confirm password...">
                                                        <p class="inp_msg"></p>
                                                    </label>
            `
            let user = (): string =>{
                let raw = localStorage.getItem("BUW_data")
                let dat = ""
                if(raw && raw != "new" && state == "login"){
                    let data: UserCahedData = JSON.parse(raw)
                    dat = data.user
                }else if(raw == "new" && state == "login"){
                    dat = "new"
                }
                return dat
            }
            this.inHtml = `
            <form id="log_sign_frm">
                <p class="frm_msg hide">opertion has failed</p>
                <span class="hide" ><i class="fa-solid fa-spinner"></i></span>
                <label>
                    <input type="text" name="username" required placeholder="${state == "login" ? "Enter your username..." : "Enter a username..."}" value="${user() == "new" ? "" : user()}">
                    <p class="inp_msg"></p>
                </label>
                <label>
                    <input type="password" name="password" required id="realpw" placeholder="${state == "login" ? "Enter your password..." : "Enter a password..."}">
                    <p class="inp_msg"></p>
                </label>
                ${sub_html}
                <input type="submit" value="submit">
                <p class="has_acc  ${state == "signup" ? "" : "hide"}">Already have an account with us? <span class="ch_to_log" data-set="log">Login</span></p>
                <p class="has_acc ${state == "signup" ? "hide" : ""}">Would you like to sign up? <span class="ch_to_log"  data-set="sign">Sign up</span></p>
                <p class="has_acc ${state == "signup" ? "hide" : ""}">Did you forget your password? <span class="ch_to_log" data-set="f_p">Forgot password</span></p>
            </form>
            `
            this.strater()
            this.newdev.querySelector(".endModal")?.classList.remove("hide")
            this.newdev.querySelector(".endModal")?.addEventListener("click",()=> this.endModal())
            this.newdev.querySelectorAll<HTMLSpanElement>(".ch_to_log").forEach((item) => {
                let set = item.dataset['set']
                item.onclick = (e) => {
                    if(set == "sign")
                        this.endModal(()=>{this.openForm("signup",()=>{if(run) run()})})
                    else if(set == "log")
                        this.endModal(()=>{this.openForm("login",()=>{if(run) run()})})
                    else
                        this.endModal(()=> this.for_password())
                }
            })
            let upperletters =  /[A-Z]/,
            lowerletters = /[a-z]/,
            numbers = /[0-9]/
            
            let inputQueue : NodeListOf<HTMLInputElement> = this.newdev.querySelectorAll("input")
            inputQueue.forEach(item => {
                if(state == "signup"){
                    item.addEventListener("input",function(){signup_inputchecker(this)})
                }else{
                    item.addEventListener("input",function(){login_inputchecker(this)})
                }
                item.addEventListener("blur",function(){blurchecker(this)})
            })
            function login_inputchecker (element:HTMLInputElement){
                let msg_field = element.parentElement?.querySelector(".inp_msg")
                if(element.classList.contains("err")){
                    element.classList.remove("err")
                    if(msg_field){
                        msg_field.textContent = ""
                    }
                }
            }
            function signup_inputchecker(element:HTMLInputElement){
                let parentForm = element.closest(".floater"),
                msg_field = element.parentElement?.querySelector(".inp_msg"),
                submitButton = parentForm?.querySelector("input[type='submit']")
                
                if(parentForm && msg_field && submitButton){
                    if(element.type == "password"){
                        if(element.id == "realpw" && state == "signup"){
                            if(element.value.length < 6){
                                classSet("err")
                            }else{
                                if(!element.value.match(upperletters) && element.value.match(numbers) && element.value.match(lowerletters)){
                                    classSet("med")
                                }else if(element.value.match(upperletters) && !element.value.match(numbers) && element.value.match(lowerletters)){
                                    classSet("med")
                                }else if(!element.value.match(upperletters) && !element.value.match(numbers) && element.value.match(lowerletters)){
                                    classSet("err")
                                }else if(!element.value.match(upperletters) && element.value.match(numbers) && !element.value.match(lowerletters)){
                                    classSet("err")
                                }else if(element.value.match(upperletters) && !element.value.match(numbers) && !element.value.match(lowerletters)){
                                    classSet("err")
                                }else if(element.value.match(upperletters) && element.value.match(numbers) && !element.value.match(lowerletters)){
                                    classSet("med")
                                }else{
                                    classSet("succ")
                                }
                            }
                        }else{
                            if(element.classList.contains("err"))
                                element.classList.remove("err")
                                msg_field.textContent = ""
                        }
                    }else{
                        if(element.value.length < 3){
                            msg_field.textContent = "too short (min: 3 characters)"
                        }else if(element.value.length > 10){
                            msg_field.textContent = "too long (max: 10 characters)"
                        }else{
                            msg_field.textContent = ""
                            if(element.classList.contains("err"))
                                element.classList.remove("err")
                        }
                    }
                    function classSet (text: string){
                        if(msg_field){
                            if(text == "succ"){
                                if(msg_field.classList.contains("med")){
                                    msg_field.classList.replace("med","succ")
                                }else if(msg_field.classList.contains("err")){
                                    msg_field.classList.replace("err","succ")
                                }else{
                                    msg_field.classList.add("succ")
                                }
                                if(element.classList.contains("err"))
                                    element.classList.remove("err")
                                msg_field.textContent = "strong"
                            }else if(text == "med"){
                                if(msg_field.classList.contains("succ")){
                                    msg_field.classList.replace("succ","med")
                                }else if(msg_field.classList.contains("err")){
                                    msg_field.classList.replace("err","med")
                                }else{
                                    msg_field.classList.add("med")
                                }
                                if(element.classList.contains("err"))
                                    element.classList.remove("err")
                                msg_field.textContent = "medium"
                            }else{
                                if(msg_field.classList.contains("succ")){
                                    msg_field.classList.replace("succ","err")
                                }else if(msg_field.classList.contains("med")){
                                    msg_field.classList.replace("med","err")
                                }else{
                                    msg_field?.classList.add("err")
                                }
                                msg_field.textContent = "weak"
                            }
                        }
                    }
                }
            }
            function blurchecker (element:HTMLInputElement){
                let par = element.closest(".floater"),
                org_pw_field = par?.querySelector<HTMLInputElement>("#realpw"),
                frmMsg = element.parentElement?.querySelector(".inp_msg")
                if(par && org_pw_field && frmMsg){
                    if(element.id == "n_w"){
                        if(org_pw_field.value.length > 0){
                            if(org_pw_field.value !== element.value){
                                element.classList.add("err")
                                frmMsg.textContent = "incorrect password"
                            }
                        }

                        if(element.value.length < 1){
                            element.classList.add("err")
                            frmMsg.textContent = "password field cannot be empty"
                        }
                    }else{
                        if(element.value.length < 1){
                            if(frmMsg.classList.contains("med")){
                                frmMsg.classList.replace("med","err")
                            }else{
                                frmMsg.classList.add("err")
                            }
                            frmMsg.textContent = element.type == "password" ? "password field cannot be empty" : "username field cannot be empty"
                            element.classList.add("err")
                        }else if(element.value.includes(" ") && frmMsg){
                            element.classList.add("err")
                            frmMsg.classList.add("err")
                            frmMsg.textContent = "spaces are not allowed"
                        }else{
                            if(state == "signup" && element.value.length > 2 && element.value.length < 11 && element.name == "username"){
                                findperson(element.value).subscribe({
                                    next: (res)=>{
                                        if(res.condition < 1){
                                            element.classList.add("err")
                                            if(frmMsg) frmMsg.textContent = `"${element.value}" is already in use`
                                        }
                                    },
                                    error: (err)=>{
                                        if(frmMsg){
                                            frmMsg.closest("form")?.querySelector<HTMLParagraphElement>(".frm_msg")?.classList.remove("hide")
                                            frmMsg.classList.add("err")
                                            frmMsg.textContent = "SERVER ERROR: Failed to validate username"
                                            element.classList.add("err")
                                        }
                                    }
                                })
                            }
                        }
                    }
                }
            }
            function btnCofirmer (): boolean | string | undefined{
                let b : boolean | string | undefined;
                if(state == "signup"){
                    let input_1_confirm = inputQueue[0].value.length > 2 && inputQueue[0].value.length < 11 ? true : false
                    let input_2_confirm = inputQueue[1].parentElement?.querySelector(".inp_msg")?.classList.contains("succ") ? true : false
                    let input_3_confirm = inputQueue[2].value == inputQueue[1].value ? true : false
                    
                    if(input_1_confirm && input_2_confirm && input_3_confirm){
                        inputQueue.forEach(i => {
                            if(i.classList.contains("err"))
                                i.classList.remove("err")
                        })
                        b = true
                    }else{
                        if(!input_1_confirm)
                            inputQueue[0].classList.add("err")
                        else if(!input_2_confirm){
                            inputQueue[1].classList.add("err")
                        }else if(!input_3_confirm){
                            inputQueue[2].classList.add("err")
                        }

                        b = false
                    }
                }else{
                    let input_1_confirm = inputQueue[0].value.length > 0 ? true : false
                    let input_2_confirm = inputQueue[1].value.length > 0  ? true : false

                    if(input_1_confirm && input_2_confirm){
                        b = true
                    }else{
                        b = false
                    }
                }
                return b
            }

            this.newdev.querySelector("form")?.addEventListener("submit",(item => {
                item.preventDefault()
                let frorm = this.newdev?.querySelector("form")
                let form = new FormData(frorm!)
                let username : string | undefined = form.get("username") != null ? form.get("username")?.toString() : "",
                password : string | undefined = form.get("password") != null ? form.get("password")?.toString() : "";

                if(btnCofirmer() && form != null){
                    frmload("on") 
                    allinput(true)
                    if(state == "signup"){
                        this.watch.makeNewUser(form_data_parser(username, password)).subscribe({
                            next: (resolve) => {
                                frmload("off",true,"sign up successful")
                                let data = localStorage.getItem("BUW_data")
                                let usser: UserCahedData = {
                                    user: typeof username == "string" ? username : "unkown user",
                                    verification : false
                                }
                                if(data == "new"){
                                    localStorage.setItem("BUW_data",JSON.stringify(usser))
                                }else{
                                    localStorage.setItem("BUW_data",JSON.stringify(usser))
                                }
                            },
                            error: (err: any )=>{
                                if(err.error && typeof err.error != "string"){
                                    if(err.status == 0){
                                        frmload("off",false,"Seems our server is offline")
                                    }else{
                                        frmload("off",false,err.statusText)
                                    }
                                }else{
                                    frmload("off",false,err.error)
                                }
                                fromRest()
                            },complete: ()=>{
                                if(run != undefined){
                                    run()
                                }
                            }
                        })
                    }else{
                        this.watch.loginuser(form_data_parser(username,password)).subscribe({
                            next: (resolve)=>{
                                if(resolve.condition == 1){
                                    frmload("off",true,"welcome: " + username)
                                    let usse : UserCahedData = {
                                        user : !username ? "unknown user" : username,
                                        verification : resolve.msg && resolve.msg.includes("ver") ? true : false
                                    }
                                    if(user() == "new"){
                                        let m = `welcome "${username}", to my little project , i hope you enjoy going through the app`
                                        setTimeout(() => {
                                            this.ondialog(m , 1)
                                        }, 10_000);
                                    }else if(user() != "new" && usse.verification == false){
                                        let m = `Hello "${username}", why don't you get verified on the app so you can create collections`
                                        setTimeout(() => {
                                            this.ondialog(m , 1)
                                        }, 5_000);
                                    }
                                    localStorage.setItem("BUW_data",JSON.stringify(usse))
                                    if(run) run()
                                }else if(resolve.condition == -1){
                                    alert("this part has not been handled")
                                }else{
                                    frmload("off",false,resolve.msg)
                                    fromRest()
                                }
                            },
                            error: (err) => {
                                if(err.error && typeof err.error != "string"){
                                    if(err.status == 0){
                                        frmload("off",false,"Seems our server is offline")
                                    }else{
                                        frmload("off",false,err.statusText)
                                    }
                                }else{
                                    frmload("off",false,err.error)
                                }
                                fromRest()
                            }
                        })
                    }
                }

                function fromRest (){
                    allinput(false)
                    frorm?.reset()
                    frorm?.querySelectorAll(".inp_msg").forEach(item => {
                        item.textContent = ""
                    })
                }
                function form_data_parser(username?: string , password?: string):SignupLoginModel{
                    return {
                        username,
                        password
                    }
                }
                function allinput (bol: boolean):void{
                    frorm?.querySelectorAll("input").forEach((item => {
                        if(bol){
                            item.classList.add("pending")
                        }else{
                            item.classList.remove("pending")
                        }
                    }))
                }
                function frmload (state: string, error?: boolean , message?: string | null){
                    let msg_holder = frorm?.querySelector(".frm_msg"),
                    div_wt_th_anim = frorm?.querySelector("span")
                    
                    if(state == "on"){
                        if(msg_holder && div_wt_th_anim){
                            if(msg_holder.textContent && !msg_holder.classList.contains("hide")){
                                msg_holder.textContent = ""
                                msg_holder.classList.add("hide")
                            }
                            if(div_wt_th_anim.classList.contains("hide"))
                                div_wt_th_anim.classList.remove("hide")
                        } 
                    }else if(error == false){
                        if(state == "off"  && div_wt_th_anim && msg_holder){
                            if(!div_wt_th_anim.classList.contains("hide")){
                                div_wt_th_anim.classList.add("hide")
                            }
    
                            if(msg_holder.classList.contains("hide")){
                                msg_holder.classList.remove("hide")
                                if(message != undefined){
                                    msg_holder.textContent = message
                                }
                                setTimeout(()=>{
                                    if(msg_holder){
                                        msg_holder.classList.add("hide")
                                        msg_holder.textContent = ""
                                    }
                                },4000)
                            }
                        }
                    }else if(error == true){
                        if(state == "off"  && div_wt_th_anim && msg_holder){
                            if(!div_wt_th_anim.classList.contains("hide")){
                                div_wt_th_anim.classList.add("hide")
                            }
    
                            if(msg_holder.classList.contains("hide")){
                                msg_holder.classList.replace("hide","succ")
                                if(message != undefined){
                                    msg_holder.textContent = message
                                }
                                setTimeout(()=>{
                                    if(msg_holder){
                                        msg_holder.classList.replace("succ","hide")
                                        msg_holder.textContent = ""
                                    }
                                    s()
                                },2000)
                            }
                        }
                    }else if(state == "off"){
                        if(msg_holder && div_wt_th_anim){
                            if(msg_holder.textContent || !div_wt_th_anim.classList.contains("hide") || !msg_holder.classList.contains("hide")){
                                msg_holder.textContent = ""
                                msg_holder.classList.add("hide")
                                div_wt_th_anim.classList.add("hide")
                            }
                        }
                    }
                    else{
                        alert("frmload error")
                    }
                }
            }))
        }else{
            alert(`"openForm" is missing a "login" or "signup" input`)
        }
        let s = () => this.endModal()
        let findperson = (data: string) => this.watch.findIfUserExist(data)
    }

    askquestion(q: string , ifyes?: ()=> void , ifno?: ()=> void){
        this.title = "message"
        this.inHtml = `
            <p class="dialog_msg">${q}</p>
            <div class="btn_holder">
                <button>no</button>
                <button>yes</button>
            </div>
        `
        this.strater()
        this.newdev.querySelector("h2")?.classList.add("n_c")
        let btn_holder : HTMLDivElement | null = this.newdev.querySelector<HTMLDivElement>(".btn_holder"),
        allbtnBtn : NodeListOf<HTMLButtonElement> | undefined = btn_holder?.querySelectorAll<HTMLButtonElement>("button")
        if(btn_holder && allbtnBtn){
            allbtnBtn.forEach((item: HTMLButtonElement) => {
                item.onclick = () => {
                    if(item.textContent == "no"){
                        this.endModal(()=>{
                            if(ifno) ifno()
                        })
                    }else{
                        this.endModal(()=>{
                            if(ifyes) ifyes()
                        })
                    }
                }
            })
        }
    }

    shuffler (arr: any[],): number {
        return Math.floor(Math.random() * arr.length)
    }

    randomArrayWithRange(start: number, end: number) {
        let rand = Math.floor((Math.random() * end) + start)
        while (rand > end) {
            rand = Math.floor((Math.random() * end) + start)
        }
        return rand
    }
    randcolour: ()=> string = () => {
        let colours : string[] = ["#00AAB4","#324B4C","#8F91B6","#EEE8A9","#005542","#A73A00"]
        return colours[this.shuffler(colours)]
    }
    endModal (run ?: ()=>void): void{
        this.title = undefined
        let dev = this.newdev.querySelector(".float-box")
        dev?.classList.remove("activate")
        let topbtn = this.newdev?.querySelector(".endModal")
        let errMsgBtn = this.newdev?.querySelector(".dialog_btn")
        let form = this.newdev?.querySelector("form")
        dev?.addEventListener("transitionend",()=>{
            if(form != null){
                form.querySelectorAll("input").forEach((item => {
                    item.removeEventListener("input",()=>{})
                }))
                form.removeEventListener("submit",()=>{})
            }else if(topbtn != null){
                topbtn?.removeEventListener("click",()=>{})
            }else if(errMsgBtn != null && !this.stopper){
                errMsgBtn.removeEventListener("click",()=>{})
            }
            if(!this.stopper){
                dev?.parentElement?.remove()
            }
            if(run){
                run();
            }
        },{
            once: true
        })
    }
    anythingtaker(nameofhtmldoc: string , runner: (dom: HTMLDivElement) => void, add_close_btn?: boolean){
        this.inHtml = `<div class="${nameofhtmldoc}"><dot class="dom_loader"><i style="color: var(--n_grren);" class="fa-solid fa-spinner"></i></dot></div>`
        this.strater()
        this.newdev.querySelector(".float-box")?.classList.add("loading")
        this.watch.getHTMLDocument(nameofhtmldoc).subscribe({
            next: (data)=>{
                if(data.condition == 1 && data.msg){
                    let r = this.newdev.querySelector<HTMLDivElement>(`.${nameofhtmldoc}`)
                    this.newdev.querySelector(".float-box")?.classList.remove("loading")
                    if(r){
                        r.innerHTML = data.msg
                        runner(r)
                    }
                    if(add_close_btn) addCloseBtn()
                }
            },
            error: (err)=>{
                this.endModal(()=>{
                    let msg = err.error ? err.error : "seems there is an error, pls try again later"
                    this.ondialog(msg,0)
                })
            }
        })
        let addCloseBtn = () => {
            let btn = this.newdev.querySelector<HTMLParagraphElement>(".endModal")
            btn?.classList.remove("hide")
        }
    }
    pass_validator(element: HTMLInputElement , msg_field: HTMLParagraphElement){
        let upperletters =  /[A-Z]/,
            lowerletters = /[a-z]/,
            numbers = /[0-9]/

        if(!element.value.match(upperletters) && element.value.match(numbers) && element.value.match(lowerletters)){
            classSet("med")
        }else if(element.value.match(upperletters) && !element.value.match(numbers) && element.value.match(lowerletters)){
            classSet("med")
        }else if(!element.value.match(upperletters) && !element.value.match(numbers) && element.value.match(lowerletters)){
            classSet("err")
        }else if(!element.value.match(upperletters) && element.value.match(numbers) && !element.value.match(lowerletters)){
            classSet("err")
        }else if(element.value.match(upperletters) && !element.value.match(numbers) && !element.value.match(lowerletters)){
            classSet("err")
        }else if(element.value.match(upperletters) && element.value.match(numbers) && !element.value.match(lowerletters)){
            classSet("med")
        }else{
            classSet("succ")
        }
        function classSet (text: string){
            if(msg_field){
                if(text == "succ"){
                    if(msg_field.classList.contains("med")){
                        msg_field.classList.replace("med","succ")
                    }else if(msg_field.classList.contains("err")){
                        msg_field.classList.replace("err","succ")
                    }else{
                        msg_field.classList.add("succ")
                    }
                    if(element.classList.contains("err"))
                        element.classList.remove("err")
                    msg_field.textContent = "strong"
                }else if(text == "med"){
                    if(msg_field.classList.contains("succ")){
                        msg_field.classList.replace("succ","med")
                    }else if(msg_field.classList.contains("err")){
                        msg_field.classList.replace("err","med")
                    }else{
                        msg_field.classList.add("med")
                    }
                    if(element.classList.contains("err"))
                        element.classList.remove("err")
                    msg_field.textContent = "medium"
                }else{
                    if(msg_field.classList.contains("succ")){
                        msg_field.classList.replace("succ","err")
                    }else if(msg_field.classList.contains("med")){
                        msg_field.classList.replace("med","err")
                    }else{
                        msg_field?.classList.add("err")
                    }
                    msg_field.textContent = "weak"
                }
            }
        }
    }
    currency_setter (num:number):string{
        let curr = new Intl.NumberFormat("en-NG",{
            style: "currency",
            currency: "NGN"
        })
        return curr.format(num)
    }
    for_password():void {
        let user_data = localStorage.getItem("BUW_data")
        if(user_data){
            let parsed_Data: UserCahedData = JSON.parse(user_data)
            if(parsed_Data.verification){
                this.anythingtaker("fpass", (dom) => {
                    this.for_pass_set(dom)
                },true)
            }else{
                let ques_msg = "oops seems like this account wasn't verifed and password cannot be reset, would you like to sign up as a new user",
                signup_succ_msg = "Congrats, you've been registered successully"
                this.endModal(()=> this.askquestion(ques_msg,()=> this.openForm("signup",()=> {setTimeout(()=> this.ondialog(signup_succ_msg , 1), 3000)})))
            }
        }else{
            let ques_msg = "you have no prior login to this account, would you like to sign up as a new user",
            signup_succ_msg = "Congrats, you've been registered successully"
            this.endModal(()=> this.askquestion(ques_msg,()=> this.openForm("signup",()=> {setTimeout(()=> this.ondialog(signup_succ_msg , 1), 3000)})))
        }
    }
    private for_pass_set(dom_element: HTMLDivElement) {
        let form = dom_element.querySelector<HTMLFormElement>("form"),
        inp = form?.querySelector<HTMLInputElement>(".fp_inp"),
        inp_msg_box = form?.querySelector<HTMLParagraphElement>(".inp_msg"),
        loader = form?.parentElement?.querySelector<HTMLDivElement>(".fpload"),
        spinner = loader?.querySelector<HTMLElement>(".fa-solid"),
        msgfield = loader?.querySelector<HTMLParagraphElement>(".fp_msger"),
        classobj = this
        let str_data = localStorage.getItem("BUW_data")
        
        if(inp && form){
            inp.oninput = inpfunc
            if(str_data && inp){
                let sort_dt: UserCahedData = JSON.parse(str_data)
                form.onsubmit = (e)=> sub_func(e, sort_dt.user)
            }
        }

        function inpfunc(e:Event){
            if(inp_msg_box){
                let inp_field = e.target as HTMLInputElement,
                val = inp_field.value,
                msg = ""
                inp_field.classList.add("err")

                if(val.length < 4 && val.length > 1)
                    msg = "enter a valid email"
                else if(val.charAt(val.length - 1) == "@")
                    msg = "email cannot end with \"@\" "
                else if(val.indexOf("@") < 0)
                    msg = "\"@\" is required"
                else if(val.length < 1)
                    msg = "this field cannot be empty"
                else{
                    msg = ""
                    inp_field.classList.remove("err")
                }

                inp_msg_box.textContent = msg
            }
        }

        function sub_func(e: SubmitEvent , user:string) {
            e.preventDefault()
            if(inp_msg_box?.textContent == "" && inp){
                Load.load()

                classobj.watch.check_mail(user , inp.value).subscribe((e)=>{
                    if(e.condition == 1 && inp){
                        classobj.watch.verify_email(inp.value).subscribe((e) => {
                            if(e.condition == 1){
                                if (e.msg) classobj.otp(parseInt(e.msg))
                            }else{
                                Load.msg = `the email sending process has ${e.msg}`
                                Load.stop_w_m()
                            }
                    } , (er) => {
                        Load.msg = er.error ? er.error : "Server error, the otp process failed occured"
                        Load.stop()
                    })
                    }else{
                        Load.msg = e.msg  ? e.msg : "some system error occured"
                        Load.stop_w_m()
                    }
                } , (er)=> {
                    Load.msg = er.error ? er.error : "Server error, the process failed"
                    Load.stop_w_m()
                })
            }
        }

        let Load = {
            loading: false,
            hide: "hide",
            msg: "",
            load : function(){
                this.loading = true
                if(loader){
                    spinner?.classList.remove(this.hide)
                    msgfield?.classList.add(this.hide)
                    loader.classList.remove(this.hide)
                    form?.classList.add("disabled")
                }
            },
            stop: function (){
                if(loader){
                    spinner?.classList.add(this.hide)
                    msgfield?.classList.add(this.hide)
                    loader.classList.add(this.hide)
                    form?.classList.remove("disabled")
                }
            },
            stop_w_m: function(){
                if(this.msg){
                    spinner?.classList.add(this.hide)
                    msgfield?.classList.remove(this.hide)
                    if(msgfield) msgfield.textContent = this.msg
                }else{
                    throw new Error("no message given for stdout")
                }
                setTimeout(()=> this.stop() , 3000)
            }
        }
    }
    private otp(otp: number): void {
        let classobj = this
        this.anythingtaker("otp",(dom) => {
            set_listeners(dom)
        } , true)

        function set_listeners (d: HTMLDivElement) {
            let loader = d.querySelector<HTMLDivElement>(".fpload"),
            spinner = loader?.querySelector<HTMLElement>(".fa-solid"),
            msgfield = loader?.querySelector<HTMLParagraphElement>(".fp_msger"),
            inp = d.querySelector<HTMLInputElement>("#otp_inp"),
            form = d.querySelector<HTMLFormElement>("form")
            
            if(inp && form){
                inp.oninput = (e) => inp_val(e)
                form.onsubmit = (e) => {
                    if(inp) sub_eve(e , inp)
                }
            }

            function inp_val (e : Event) {
                let input = e.target as HTMLInputElement,
                val = input.value,
                msg_field = input.parentElement?.querySelector<HTMLParagraphElement>(".inp_msg")
                
                if (msg_field) {
                    if (val.length < 1)
                        msg_field.textContent = "too short ( invalid )"
                    else if(val.length > 6)
                        msg_field.textContent = "too long ( invalid )"
                    else
                        msg_field.textContent = ""
                }
            }
            
            function sub_eve (e : SubmitEvent , ip : HTMLInputElement) {
                e.preventDefault()
                Load.load()
                if(parseInt(ip.value) != otp)
                    setTimeout(() => {
                        Load.msg = "the pin you entered is invalid"
                        Load.stop_w_m()
                    }, 2000);
                else
                    classobj.endModal(()=> classobj.set_new_pass())
            }

            let Load = {
                loading: false,
                hide: "hide",
                msg: "",
                load : function(){
                    this.loading = true
                    if(loader){
                        spinner?.classList.remove(this.hide)
                        msgfield?.classList.add(this.hide)
                        loader.classList.remove(this.hide)
                        form?.classList.add("disabled")
                    }
                },
                stop: function (){
                    if(loader){
                        spinner?.classList.add(this.hide)
                        msgfield?.classList.add(this.hide)
                        loader.classList.add(this.hide)
                        form?.classList.remove("disabled")
                    }
                },
                stop_w_m: function(){
                    if(this.msg){
                        spinner?.classList.add(this.hide)
                        msgfield?.classList.remove(this.hide)
                        if(msgfield) msgfield.textContent = this.msg
                    }else{
                        throw new Error("no message given for stdout")
                    }
                    setTimeout(()=> this.stop() , 3000)
                }
            }
        }
    }
    private set_new_pass() {
        this.anythingtaker("newpass",(dom) => {
            let all_ins : NodeListOf<HTMLInputElement> = dom.querySelectorAll("input")
            let frm = dom.querySelector("form")
            let loader = dom?.parentElement?.querySelector<HTMLDivElement>(".fpload"),
            spinner = loader?.querySelector<HTMLElement>(".fa-solid"),
            msgfield = loader?.querySelector<HTMLParagraphElement>(".fp_msger")

            all_ins.forEach((item => {
                if(item.type == "password"){
                    let parent = item.parentElement
                    if(parent != null){
                        let clickicon = document.createElement("i")
                        clickicon.className = "fa-solid fa-eye"
                        parent.appendChild(clickicon)
                        clickicon.addEventListener("click",eyetoggle)
                    }
                }

                function eyetoggle(e: MouseEvent){
                    let con : Element = e.target as Element
                    if(item.value.length > 0)
                    if(item.type == "password"){
                        item.type = "text"
                        con.className = "fa-solid fa-eye-slash"
                    }else{
                        item.type = "password"
                        con.className = "fa-solid fa-eye"
                    }
                }
            }))

            all_ins.item(0).oninput = (e) => {
                let inp = e.target as HTMLInputElement,
                msg_box = inp.parentElement?.querySelector<HTMLParagraphElement>(".inp_msg")
                inp.classList.remove("err")
                if(msg_box){
                    this.pass_validator(inp , msg_box)
                    if(inp.value.length < 1){
                        msg_box.textContent = "this field cannnot be empty"
                        msg_box.classList.replace("succ","err")
                    }
                }
            }
            all_ins.item(1).oninput = (e) => {
                let ip = e.target as HTMLInputElement
                ip.classList.remove("err")
            }

            if(frm) frm.onsubmit = (e) => {
                Load.load()
                e.preventDefault()
                let new_pass = all_ins.item(0),
                con_pass = all_ins.item(1),
                f_msg = new_pass.parentElement?.querySelector<HTMLParagraphElement>(".inp_msg")

                if(new_pass.value != con_pass.value){
                    Load.msg = "the inputs don't match"
                    con_pass.classList.add("err")
                    Load.stop_w_m()
                }else if(f_msg && f_msg.textContent?.includes("strong") != true){
                    Load.msg = "please enter a stronger password"
                    new_pass.classList.add("err")
                    Load.stop_w_m()
                }else{
                    let data = localStorage.getItem("BUW_data")
                    if(data){
                        let p_data: UserCahedData = JSON.parse(data)
                        this.watch.change_password({username: p_data.user , password: new_pass.value}).subscribe((e) => {
                            if(e.condition == 1){
                                this.endModal(() => this.ondialog("Congrats, your password has been successfully changed", 1 ))
                            }else{
                                this.endModal(() => {
                                    if(e.msg) this.ondialog(e.msg, 0)
                                })
                            }
                        }, (e) => {
                            this.endModal(() => this.ondialog("seems we have some server error" , 0))
                        })
                    }
                }
            }
            
        let Load = {
            loading: false,
            hide: "hide",
            msg: "",
            load : function(){
                this.loading = true
                if(loader){
                    spinner?.classList.remove(this.hide)
                    msgfield?.classList.add(this.hide)
                    loader.classList.remove(this.hide)
                    frm?.classList.add("disabled")
                }
            },
            stop: function (){
                if(loader){
                    spinner?.classList.add(this.hide)
                    msgfield?.classList.add(this.hide)
                    loader.classList.add(this.hide)
                    frm?.classList.remove("disabled")
                }
            },
            stop_w_m: function(){
                if(this.msg){
                    spinner?.classList.add(this.hide)
                    msgfield?.classList.remove(this.hide)
                    if(msgfield) msgfield.textContent = this.msg
                }
                setTimeout(()=> this.stop() , 3000)
            }
        }
        } , true)
    }

    hamburger():HTMLDivElement{
        this.inHtml = `
        <div class="ham">
            <button id="log"> login </button>
            <button id="sign"> sign up </button>
            <div class="social-hold">
                <a href="https://www.linkedin.com/in/emmanuel-lasisi-7139b5233/"><i class="fa-brands fa-linkedin"></i></a>
                <a href="https://github.com/emmyoftech"><i class="fa-brands fa-github"></i></a>
                <a href="tel:+2349066057393"><i class="fa-solid fa-phone"></i></a>
            </div>
        </div>
        `
        this.strater()
        this.newdev.querySelector(".endModal")?.classList.remove("hide")
        return this.newdev
    }
}