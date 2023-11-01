import * as ethereum from '../lib/ethereum'
import { contracts } from '@/contracts.json'
import type { Main } from '../../../typechain/src/Main'
import type { Collection } from '../../../typechain/src/Collection'
import { ethers } from 'ethers'

/** une fonction qui prend la clé privée d'un utilisateur et renvoie la liste d'id des cartes qu'il possede */
export async function getUserCards(wallet: {
    details: ethereum.Details;
    contract: Main;
}) {
    const { details, contract } = wallet

    const nbCollection = await contract.getNbCollections()
    let idCard: string[] = []
    for (let i = 0; i < nbCollection; i++) {
        const collectionAddr = await contract.getCollectionFromId(i)
        const { _, abi } = contracts.Collection
        const Collection = new ethers.Contract(collectionAddr, abi, details.provider) as any as Collection
        Collection.connect(details.signer)
        const cards = await Collection.userCards()
        idCard = idCard.concat(cards)
    }
    return ['sv3-3'];
}

