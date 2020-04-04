import React from 'react';
import { connect } from 'react-redux';

import { logout } from '../../actions/auth';
import Logo from './logo';
import { Redirect } from 'react-router';
import { navigate } from '../../actions/navigate';

/**
 * App navigation
 * @method Navigation
 * @param  {Object}   props
 * @param  {Object}   props.user         user object
 * @param  {Function} props.handleLogout logout action
 */
export const Navigation = ({ user, handleLogout, navigate, handleNavigate }) => {
    if ( navigate.redirect == true) {
        return (
            <Redirect to={navigate.toWhere}/>
        )
    }
    return (
    <nav className="navbar">
        <Logo logoOnly={false} />
        {user.authenticated ? (
            <span className="user-nav-widget">
                <span>{user.name}</span>
                <img width={40} className="img-circle" src={user.profilePicture} alt={user.name} />
                <span onClick={handleLogout}>
                    <i className="fa fa-sign-out" />
                </span>
            </span>
        ) : (
            <button type="button" onClick={()=>{handleNavigate('/login')}}>Log in or sign up</button>
        )}
    </nav>
)}

export const mapStateToProps = state => ({ user: state.user, navigate: state.navigate});
export const mapDispatchToProps = dispatch => ({
    handleLogout() {
        dispatch(logout());
    },
    handleNavigate(location) {
        dispatch(navigate(location));
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
