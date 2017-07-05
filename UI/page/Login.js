// @flow
'use strict';

//FixMe importy

import React from 'react';
import Application from "../core/application/Application";
import Component from "../core/component/Component";
import * as API from "../model/GrepApi";
import Spinner from "../core/component/Spinner";
import Store from "../core/Store";
import AppNode from "../core/application/Node";
import IconEdit from "../core/component/IconEdit";
import Button from "../core/component/Button";
import Var from "../core/Var";


function setError(e) {
    if (e instanceof Error)
        e = e.message;
    if (!e)
        e = "Wystąpił nieznany błąd";
    Login.error = "" + e;
}

export default class Login extends Component {

    static username: Var<string> = new Var().localStorage("login");
    static password: Var<string> = new Var().sessionStorage("pass");
    static spinner: Spinner;
    static onAuthorized: (data: Object) => void;
    static instance: AppNode;

    static error: string;

    static logout() {
        Login.password = "";
        Store.session.remove("pass");
        Application.nodes.clone().forEach(node => node.remove());
        Login.display(Login.onAuthorized);
    }

    static display(onAuthorized: (data: Object) => void) {

        onAuthorized(null);
        return;

        Login.onAuthorized = onAuthorized;

        if (Login.username && Login.password) {

            Login.spinner = new Spinner(false);
            API.login(Login.username, Login.password, (data) => {
                Login.spinner.hide();
                // User.current.fill(data);
                Login.onAuthorized(data);
            }).catch((e) => {
                Login.spinner.hide();
                setError(e);
                display();

            });
            return;
        }

        function display() {
            Login.instance = Application.render(<Login/>,
                document.body.tag("div").css({
                    backgroundImage: "url('/res/background.jpg')",
                    backgroundRepeat: "round",
                    backgroundSize: "auto",
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
        Login.onAuthorized(data);

        Login.instance.element.css({
            transition: "all .4s ease-in"
        });

        setTimeout(() => {
            Login.instance.element.css({
                opacity: 0,
            });
            Login.instance.element.children[0].style.marginTop = "-100%";
        });

        setTimeout(() => Login.instance.remove(), 600);

    }


    process(e: Event) {
        Login.error = "";
        this.forceUpdate();

        const done = () => {
            Login.spinner.hide();
        };

        Store.local.set("login", Login.username);
        Store.session.set("pass", Login.password, true);

        Login.spinner = new Spinner(false);
        API.login(Login.username, Login.password, (data) => {
            done();
            //User.current.fill(data);
            this.onAuthorized(e);
        }).catch((e) => {
            done();
            setError(e);
            this.forceUpdate();
        })
    }

    render() {

        let err = Login.error ? <div >
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
            transition: "all .6s ease",
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
                            type="text"
                            icon="user"
                            placeholder="Login"
                            value={Login.username}
                            onChange={(e) => Login.username = e.target.value}
                            onEnter={this.process.bind(this)}
                        />

                        <IconEdit
                            type="password"
                            icon="lock"
                            placeholder="Hasło"
                            value={Login.password}
                            onChange={e => Login.password = e.target.value}
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

