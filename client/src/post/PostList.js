import React from 'react'
import propTypes from 'prop-types'
import Post from './Post'

const PostList = (props) => {
	return (
		<div style={{marginTop: '24px'}}>
			{
				props.posts.map((item, i) => {
					return (
						<Post post={item} key={i} onRemove={props.removeUpdate} />
					)
				})
			}
		</div>
	)
}

PostList.propTypes = {
	posts: propTypes.array.isRequired,
	removeUpdate: propTypes.func.isRequired
}

export default PostList