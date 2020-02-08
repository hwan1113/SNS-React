import React, { Component } from "react";
import PropTypes from "prop-types";
import parseLinkHeader from "parse-link-header";
import orderBy from "lodash.orderby";
// import { connect } from 'react-redux';

import ErrorMessage from "./components/error/Error";
import Loader from "./components/Loader";
import * as API from "./shared/http";
import Navbar from "./components/nav/navbar";
import Welcome from "./components/welcome/Welcome";
import Posts from "./components/post/Post";
/**
 * The app component serves as a root for the project and renders either children,
 * the error state, or a loading state
 * @method App
 * @module letters/components
 */

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: false,
      posts: [],
      endpoint: `${process.env.ENDPOINT}/posts?_page=1&_sort=date&_order=DESC& embed=comments&_expand=user&_embed=likes`
    };
    this.getPosts = this.getPosts.bind(this);
  }
  componentDidMount() {
    // Remove the initial state that was embedded with the intial HTML sent by the server
    // const embeddedState = document.getElementById("initialState");
    // if (embeddedState) {
    //   embeddedState.remove();
    // }
    this.getPosts();
  }

  componentDidCatch(err, info) {
    console.error(err);
    console.error(info);
    this.setState(() => {
      error: err;
    });
  }

  getPosts() {
    API.fetchPost(this.state.endpoint).then((res) => {
      return res
        .json()
        .then((posts) => {
          const links = parseLinkHeader(res.headers.get("Link"));
          this.setState(() => ({
            posts: orderBy(this.state.posts.concat(posts), "date", "desc"),
            endpoint: links.next.url
          }));
        })
        .catch((err) => {
          this.setState(() => {
            {
              error: err;
            }
          });
        });
    });
  }

  render() {
    // if (this.props.error) {
    //     return (
    //         <div className="app">
    //             <ErrorMessage error={this.props.error} />
    //         </div>
    //     );
    // }
    return (
      <div className="app">
        <Navbar />
        {this.props.loading ? (
          <div className="loading">
            <Loader />
          </div>
        ) : (
          // this.props.children
          <div className="home">
            <Welcome />
            <div>
              {this.state.posts.length && (
                <div className="posts">
                  {this.state.posts.map(({ id }) => {
                    <Post id={id} key={id} user={this.props.user} />;
                  })}
                </div>
              )}
              <button className="block" onClick={this.getPosts}>
                Load more posts
              </button>
            </div>
            <div>
              <Ad
                url="https://ifelse.io/book"
                imageUrl="/static/assets/ads/ria.png"
              />
              <Ad
                url="https://ifelse.io/book"
                imageUrl="/static/assets/ads/ria.png"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.node
};

// export const mapStateToProps = (state) => {
//   return {
//     error: state.error,
//     loading: state.loading
//   };
// };
// export default connect(mapStateToProps)(App);
export default App;
