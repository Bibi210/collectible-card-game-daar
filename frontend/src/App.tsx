import { useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styles from './styles.module.css'
import * as ethereum from '@/lib/ethereum'
import * as main from '@/lib/main'
import Home from './components/Home'
import Profile from './components/Profile';
import Booster from './components/Booster';
import MarketPlace from './components/MarketPlace' ;

type Canceler = () => void
const useAffect = (
  asyncEffect: () => Promise<Canceler | void>,
  dependencies: any[] = []
) => {
  const cancelerRef = useRef<Canceler | void>()
  useEffect(() => {
    asyncEffect()
      .then(canceler => (cancelerRef.current = canceler))
      .catch(error => console.warn('Uncatched error', error))
    return () => {
      if (cancelerRef.current) {
        cancelerRef.current()
        cancelerRef.current = undefined
      }
    }
  }, dependencies)
}

export const useWallet = () => {
  const [details, setDetails] = useState<ethereum.Details>()
  const [contract, setContract] = useState<main.Main>()
  useAffect(async () => {
    const details_ = await ethereum.connect('metamask')
    if (!details_) return
    setDetails(details_)
    const contract_ = await main.init(details_)
    if (!contract_) return
    setContract(contract_)
  }, [])
  return useMemo(() => {
    if (!details || !contract) return
    return { details, contract }
  }, [details, contract])
}

export const App = () => {
  const wallet = useWallet()
  if (wallet)
    return (
      <>
      <BrowserRouter>
      <Routes>
        
          <Route path='/' element={<Home />} />
          <Route path="/profile" element={<Profile wallet={wallet} />} />
          <Route path='/booster' element={<Booster wallet={wallet} />} />
          <Route path='/MarketPlace' element={<MarketPlace wallet={wallet} />} />
      
      </Routes>
    </BrowserRouter>
    </>
    )
}
