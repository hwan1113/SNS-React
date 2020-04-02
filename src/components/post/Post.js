import PropTypes from "prop-types";
import React, { Component } from "react";

import Content from "./Content";
import Image from "./Image";
import Link from "./Link";
import PostActionSection from "./PostActionSection";
import Comments from "../comment/Comments";
import DisplayMap from "../map/DisplayMap";
import UserHeader from "../post/UserHeader";
import * as API from "../../shared/http";

import RouterLink from "../router/Link";

export class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: {},
      comments: [],
      showComments: false,
      user: this.props.user
    };
    this.loadPost = this.loadPost.bind(this);
  }
  componentDidMount() {
    this.loadPost(this.props.id);
  }
  loadPost(id) {
    API.fetchPost(id)
      .then((res) => res.data)
      .then((post) => {
        this.setState(() => ({ post }));
      });
  }
  render() {
    if (!this.state.post) {
      return <Loader />;
    }
    return (
      <div className="post">
        <UserHeader date={this.state.post.date} user={this.state.post.user} />
        {/* <Content post={this.state.post} /> */}
        {/* <Image post={this.state.post} /> */}
        {/* <Link link={this.state.post.link} /> */}
        {/* <PostActionSection showComments={this.state.showComments} /> */}
        {/* <Comments
          comments={this.state.comments}
          show={this.state.showComments}
          post={this.state.post}
          user={this.props.user}
        /> */}
      </div>
    );
  }

}

Post.propTypes = {
    // post: PropTypes.object.isRequired,
    comments: PropTypes.array,
    content: PropTypes.string,
    date: PropTypes.number,
    id: PropTypes.string.isRequired,
    image: PropTypes.string,
    likes: PropTypes.array,
    location: PropTypes.object,
    user: PropTypes.object,
    userId: PropTypes.string
};

export default Post;

// /**
//  * Displays a post
//  * @method      Post
//  * @param       {props} props
//  * @constructor
//  */
// function Post(props) {
//     const { post } = props;
//     return post ? (
//         <div className="post">
//             <RouterLink to={`/posts/${post.id}`}>
//                 <span>
//                     <UserHeader date={post.date} user={post.user} />
//                     <Content post={post} />
//                     <Image post={post} />
//                     <Link link={post.link} />
//                 </span>
//             </RouterLink>
//             {post.location && <DisplayMap location={post.location} />}
//             <PostActionSection postId={post.id} />
//             <Comments postId={post.id} />
//         </div>
//     ) : null;
// }

// Post.propTypes = {
//     post: PropTypes.object.isRequired
// };

// export default Post;
