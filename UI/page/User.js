import React from 'react';
import PropTypes from 'prop-types';

import lang from "../model/Lang";
import Page from "./Page";
import User from "../model/User";

export default class PUser extends Page {


    constructor() {
        super(lang.user.user, ...arguments);
        //    this.user = this.props.user;
    }


    render() {

        return <div>

            <h3>{lang.user.user}</h3>

            <table className="table">
                <tbody>
                <tr>
                    <td>Id</td>
                    <td>{User.current.id}</td>
                </tr>
                <tr>
                    <td>Login</td>
                    <td>{User.current.login}</td>
                </tr>
                <tr>
                    <td>Imię</td>
                    <td>{User.current.firstName}</td>
                </tr>
                <tr>
                    <td>Nazwisko</td>
                    <td>{User.current.lastName}</td>
                </tr>
                <tr>
                    <td>e-mail</td>
                    <td>{User.current.email}</td>
                </tr>
                </tbody>
            </table>

            <h4>Dostępne funkcjonalności</h4>

            <table className="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Dostępna</th>
                    <th>Kod</th>
                    <th>Nazwa</th>
                </tr>
                </thead>
                <tbody>{User.current.functionalities.map(func =>
                    <tr key={func.id}>
                        <td>{func.id}</td>
                        <td>{"" + func.available}</td>
                        <td>{func.code}</td>
                        <td>{func.name}</td>
                    </tr>
                )}
                </tbody>
            </table>


        </div>

    }

    // static propTypes = {
    //     user: PropTypes.instanceOf(User).isRequired,
    // };
}