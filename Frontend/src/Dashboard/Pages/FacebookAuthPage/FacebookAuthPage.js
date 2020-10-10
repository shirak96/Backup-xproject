import PropTypes from 'prop-types'
import React from 'react'
import { FacebookProvider, LoginButton, Page } from 'react-facebook'
import DashBoarLayout from '../../Layout/DashBoarLayout'
import API from '../../Utils/api'

export default class FacebookAuthPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            profile: null,
            tokenDetail: null,
            error: null,
            pages: [
            ],
            loading: true,
            pageTokenAvailable: false,
            userTokenAvailable: false,

        }
    }


    async componentDidMount() {
        await this.checkPageToken();

    }

    checkPageToken = async () => {
        try {
            const data = await API().get('graph-api/fb/check-page-token');
            console.log(data);
            if (data.data.status.code === 200) {
                this.setState({
                    loading: false,
                    pageTokenAvailable: true,
                    userTokenAvailable: true
                })
            }
        } catch (error) {
            console.log(error);
            if (error.response.status === 404) {
                this.setState({
                    pageTokenAvailable: false
                }, async () => {
                    await this.checkUserToken()
                })
            }
        }
    }

    checkUserToken = async () => {
        try {
            const data = await API().get('graph-api/fb/check-user-token');
            if (data.data.status.code === 200) {

                this.setState({
                    loading: false,
                    userTokenAvailable: true
                }, async () => {
                    const response = await API().get('graph-api/fb/pages');
                    const userPages = response.data.data.data;
                    this.setState({
                        pages: userPages
                    })
                })
            }

        } catch (error) {
            console.log(error);
            if (error.response.status === 404) {
                this.setState({
                    loading: false,
                    userTokenAvailable: false
                })
            }
        }
    }

    setPageAccessToken = async (page) => {
        try {
            const response = await API().post('graph-api/fb/pages', {
                access_token: page.access_token,
                page_id: page.id

            });
            if (response.data.status.code === 200) {
                this.setState({
                    pageTokenAvailable: true
                })
            }
        } catch (error) {
            console.log(error)
        }
    }

    handleResponse = async (data) => {
        console.log('data', data);
        this.setState({
            profile: data.profile,
            tokenDetail: data.tokenDetail
        })
        const profile_id = data.profile.id;
        const profile_name = data.profile.name;
        const profile_image = data.profile.picture.data.url;
        const profile_email = data.profile.email;
        const access_token = data.tokenDetail.accessToken;
        const userID = data.tokenDetail.userID;
        try {
    
            await API().post('graph-api/fb', {
                profile_id,
                profile_name,
                profile_image,
                profile_email,
                access_token,
                userID
            });
            this.setState({
                userTokenAvailable: true
            }, () => {
                this.checkUserToken();
            })
        } catch (error) {
            console.log(error);
            alert(error.message)
        }

    }

    handleError = (error) => {
        this.setState({error});
    }

    render() {
        const {loading, pageTokenAvailable, userTokenAvailable, pages} = this.state;
        const {setPageAccessToken, handleResponse, handleError} = this;
        return (
            <div>
                <DashBoarLayout {...this.props}>
                    {
                        loading ? 'Loading ...' : (
                            <>
                                {
                                    userTokenAvailable ? (
                                            pageTokenAvailable ? 'Page token Available and user token available' :
                                                <PageTokenForm pages={pages} handleSelect={setPageAccessToken}/>
                                        ) :
                                        <FacebookLoginButton handleError={handleError} handleResponse={handleResponse}/>
                                }
                            </>
                        )
                    }

                </DashBoarLayout>
            </div>
        );
    }
}

const FacebookLoginButton = (props) => {
    const {handleResponse, handleError} = props;
    return (
      <>
          <FacebookProvider appId="257658278760639">
            <LoginButton
              scope="email,pages_show_list,pages_manage_posts"
              onCompleted={handleResponse}
              onError={handleError}
            >
                <span>Login via Facebook</span>
            </LoginButton>
              <Page href="https://www.facebook.com/garderlecap/" tabs="timeline" hideCover={true} width={'100%'}
                    adaptContainerWidth={true} smallHeader={true} showFacepile={false}/>
        </FacebookProvider>
      </>
    )
}

FacebookLoginButton.propTypes = {
    handleResponse: PropTypes.func,
    handleError: PropTypes.func
};

FacebookLoginButton.defaultProps = {
    handleResponse: (data) => {
        console.log(data);
    },
    handleError: (error) => {
        console.log('error ', error)
    }
};

const PageTokenForm = (props) => {
    const {pages, handleSelect} = props;
    return (
        <div>
            Select one page from the list below:
            {
                pages.map(({name, id, ...rest}) => {
                    return (
                        <div key={id}>
                            <div className='page-name'>
                                {name}
                            </div>
                            <div>
                                <button onClick={event => handleSelect({...rest, name, id})}>Select page</button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

PageTokenForm.propTypes = {
    pages: PropTypes.array,
    handleSelect: PropTypes.func
};

PageTokenForm.defaultProps = {
    pages: [],
    handleSelect: (page) => {
        console.log(page)
    }
};
