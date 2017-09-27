// @flow
'use strict';

//FixMe importy

import React from 'react';
import Application from "../core/application/Application";
import Component from "../core/component/Component";
import Spinner from "../core/component/spinner/Spinner";
import AppNode from "../core/application/Node";
import IconEdit from "../core/component/IconEdit";
import Button from "../core/component/Button";
import Var from "../core/Var";
import {DEV_MODE, PROCESS_ENV} from "../core/Dev";
import API from "../core/application/API";
import CoreConfig from "../core/config/CoreConfig";
import {UserData} from "../core/application/UserData";
import * as Utils from "../core/utils/Utils";


function setError(e) {
    if (e instanceof Error)
        e = e.message;
    if (!e)
        e = "Wystąpił nieznany błąd";
    Login.error = "" + e;
}


const username: Var<string> = new Var().localStorage("login");
const password: Var<string> = new Var().sessionStorage("pass");
const authTS: Var<number> = new Var().sessionStorage("authTS");


let idleTimeout;

function peak() {
    clearTimeout(idleTimeout);
    const expire = CoreConfig.ui.idleTimeout.value;
    if (!(expire > 0)) return;

    idleTimeout = setTimeout(() => {
        password.value = null;
        Spinner.create();
        setTimeout(() => window.location.reload(), 500);
    }, expire);
}


window.addEventListener("keydown", peak);
window.addEventListener("mousemove", peak);
window.addEventListener("resize", peak);


export default class Login extends Component {


    static spinner: Spinner;
    static onAuthorized: (data: Object) => void;
    static instance: AppNode;

    static error: string;

    constructor() {
        super(...arguments);

        const expire = CoreConfig.ui.idleTimeout.value;

        const diff: number = new Date().getTime() - authTS.value;
        if (expire > 0 && diff > expire)
            password.value = null;

    }

    static logout() {
        password.value = undefined;
        authTS.value = null;
        window.location.reload();
        // Application.nodes.clone().forEach(node => node.remove());
        // Login.display(Login.onAuthorized);
    }

    static display(onAuthorized: (data: Object) => void) {

        Login.onAuthorized = onAuthorized;

        if (true || DEV_MODE && PROCESS_ENV.AUTH === false) {
            // pomiń autoryzację w trybie deweloperskim
            onAuthorized(null);
            return;
        }


        if (username.value && password.value) {

            Login.spinner = Spinner.create();
            UserData.current = null;
            API.authorizeUser(username.value || "", password.value || "", (data) => {
                Login.spinner.hide();
                UserData.current = UserData.factory(data);
                authTS.value = new Date().getTime();
                // User.current.fill(data);
                setTimeout(() => Login.onAuthorized(data));
            }, e => {
                window.console.error(e);
                Login.spinner.hide();
                setError(e);
                display();

            });
            return;
        }

        function display() {
            Login.instance = Application.render(<Login/>,
                document.body.tag("div").css({
                    backgroundImage: "url('/res/login_background.jpg')",
                    //backgroundRepeat: "round",
                    backgroundSize: "100%",
                    zIndex: 1,
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    right: 0
                }));
            Login.instance.ownHtmlNode = true;
        }

        display();
    }

    onAuthorized(data: any) {


        Login.instance.element.css({
            transition: "all .5s ease-in"
        });

        setTimeout(() => {
            Login.instance.element.css({
                opacity: 0,
            });
            Login.instance.element.children[0].style.marginTop = "-100%";
        });

        setTimeout(() => Login.instance.remove(), 600);
        setTimeout(() => Login.onAuthorized(data));

    }


    process(e: Event) {
        Login.error = "";

        // rozwiązanie problemu zapamiętywania hasła
        document.getElementById("edtPassword").value = "";
        document.getElementById("edtPassword").setAttribute("value", "");
        document.getElementById("edtPassword").disabled = true;
        document.getElementById("edtLogin").disabled = true;

        e.preventDefault();
        e.cancelBubble = true;

        this.forceUpdate();

        const done = () => {
            Login.spinner.hide();
        };

        UserData.current = null;
        Login.spinner = Spinner.create();
        API.authorizeUser(username.value, password.value, (data) => {
            done();
            UserData.current = UserData.factory(data);

            authTS.value = new Date().getTime();
            //User.current.fill(data);
            this.onAuthorized(e);
        }, e => {
            done();
            setError(e);
            this.forceUpdate();
        });
    }

    render() {

        document.title = "Logowanie";

        let err = Login.error ? <div>
            <span style={{
                display: "inline-block",
                flex: "auto",
                color: "#ddd",
                margin: "-20px 10px 30px 10px",
                padding: "10px",
                textShadow: "1px 1px 1px #666",
                backgroundColor: "rgba(200, 0, 0, 0.5)",
                fontSize: "16t",
                minWidth: "50%",
                borderRadius: "6px",
                border: "1px solid #622",
                boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.5)"
            }}>{Login.error}</span>
        </div> : null;


        return <div style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            transition: "all 2s ease",
            display: "flex",
            flexDirection: "column"
        }}>
            <span style={{
                position: "absolute",
                zIndex: -1
            }}>
                  <img src="/res/cktechnik.png" style={{opacity: "0.6"}}/>
            </span>

            <div style={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
                flex: "auto",
                fontFamily: "Verdana, Arial"
            }}>
                <div style={{
                    flex: "auto"
                }}>
                    {err}
                    <div style={{
                        display: "inline-block",
                        border: "1px solid #222",
                        padding: "30px 50px",
                        textAlign: "left",
                        backgroundColor: "rgba(0, 0, 0, 0.55)",
                        color: "#ccc",
                        borderRadius: "10px",
                        boxShadow: "3px 3px 3px rgba(0, 0, 0, 0.5)"
                    }}>
                        <div style={{
                            fontSize: "20px",
                            marginBottom: "4px",
                            color: "#aaa"
                        }}>Logowanie
                        </div>

                        <hr style={{
                            backgroundColor: "#666"
                        }}/>

                        <IconEdit
                            key={Utils.randomId()}
                            type="text"
                            icon="user"
                            id="edtLogin"
                            placeholder="Login"
                            value={username.value}
                            onChange={(e) => username.value = e.target.value}
                            onEnter={this.process.bind(this)}
                        />

                        <IconEdit
                            key={Utils.randomId()}
                            autoCompleteOff
                            id="edtPassword"
                            type="password"
                            icon="lock"
                            placeholder="Hasło"
                            value={password.value}
                            onChange={e => password.value = e.target.value}
                            onEnter={this.process.bind(this)}
                        />

                        <div style={{
                            textAlign: "right"
                        }}>
                            <Button onClick={this.process.bind(this)}
                                    title="login"
                                    type="primary"
                            >Zaloguj</Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    }
}

