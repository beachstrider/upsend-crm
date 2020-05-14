import UpsendMessenger from './messenger'
import {setCookie, getCookie, deleteCookie} from './cookies'

import {AUTH} from './graphql/queries'
import GraphqlClient from './graphql/client'

export default class UpsendMessengerEncrypted {

  constructor(props) {
    this.props = props

    const currentLang = this.props.lang || 
                        navigator.language || 
                        navigator.userLanguage

    const data = {
      referrer: window.location.path,
      email: this.props.email,
      properties: this.props.properties
    }

    this.getSession = ()=>{
      return getCookie("upsend_session_id") || "" 
    }

    this.checkCookie = (val)=>{
      setCookie("upsend_session_id", val, 365)
    }

    this.defaultHeaders = {
      app: this.props.app_id,
      enc_data: this.props.data || "",
      user_data: JSON.stringify(data),
      session_id: this.getSession(),
      lang: currentLang
    }
    this.defaultHeaders = Object.assign(this.defaultHeaders, {user_data: JSON.stringify(this.props)});

    this.graphqlClient = new GraphqlClient({
      config: this.defaultHeaders,
      baseURL: `${this.props.domain}/api/graphql`
    })

    this.graphqlClient.send(AUTH, {
      lang: currentLang
    }, {
      success: (data)=>{

        const user = data.messenger.user

        if (user && user.session_id){
          this.checkCookie(user.session_id)        
        }else{
          deleteCookie("upsend_session_id")  
        }

        const messenger = new UpsendMessenger(
          Object.assign({}, user, {platformParams: this.props},{
            app_id: this.props.app_id, 
            encData: this.props.data,
            encryptedMode: true,
            domain: this.props.domain,
            ws: this.props.ws,
            lang: user.lang,
          })
        )

        messenger.render()


      },
      errors: ()=>{
        debugger
      }
    })

    this.sendCommand = (action, data={})=>{
      let event = new CustomEvent("upsend_events", 
                                  {
                                    bubbles: true, 
                                    detail: {action: action, data: data}
                                  }); 
      window.document.body.dispatchEvent(event);
    }

  }
} 