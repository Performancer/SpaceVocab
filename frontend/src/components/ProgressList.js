import React, {useState, useEffect} from 'react'
import { withRouter } from 'react-router-dom'
import subscriptionService from '../services/subscriptions'
import store from '../store'

const ProgressList = (props) => {
  const [subscription, setSubscription] = useState(null)

  useEffect( () => {
      subscriptionService.get(props.id)
      .then(s => {
        setSubscription(s)
        console.log(s)
      })
      .catch( () => {props.history.push('/')})
  }, [store.getState().user])

  if(!subscription)
    return <div className='loader' />

  const getWords = (stage) => {
    for(let i = 4; i >= 0; i--) {
      let className = 'word'
      let title

      switch(stage) {
        case 4: className = 'perfectWord'; title = 'Perfect'; break
        case 3: title = 'Very good'; break
        case 2: title = 'Good'; break
        case 1: title = 'Basic'; break
        default: className = 'unknownWord'; title = 'Unknown'; break
      }

      const words = subscription.words.filter(w => stage === 0 ? !w.stage
            || w.stage === stage : w.stage === stage)

      if(words.length > 0) {
        return (
         <div className='package'>
           <div className='centered'><b>{title}</b></div>
           {
             words.map(w => 
             <b key={w._id} className={className}>{w.spelling}</b>)
           }
         </div>
        )
      }
    }
  }

  return (
    <div>
      <h3>Progress in '{subscription.source.name}'</h3>
      { getWords() }
    </div>
  )
}

const ProgressListWithHistory = withRouter(ProgressList)
export default ProgressListWithHistory
