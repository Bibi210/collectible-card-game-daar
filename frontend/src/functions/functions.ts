import * as ethereum from '../lib/ethereum'
import { contracts } from '@/contracts.json'
import type { Main } from '../../../typechain/src/Main'
import type { Collection } from '../../../typechain/src/Collection'
import type { Booster } from '../../../typechain/src/Booster'
import { ethers } from 'ethers'
import CollectionAbi from '@/abis/Collection.json'
import BoosterAbi from '@/abis/Booster.json'

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
        const collectionContract = await new ethers.Contract(collectionAddr, CollectionAbi, details.signer) as any as Collection
        collectionContract.connect(details.signer)
        const cards = await collectionContract.userCards()
        idCard = idCard.concat(cards)
    }
    return ["sv3pt5-7"]
}

export async function openPack(wallet: {
    details: ethereum.Details;
    contract: Main;
}, id: number) {
    const { details, contract } = wallet
    const collectionAddr = await contract.getCollectionFromId(id)
    const collectionContract = await new ethers.Contract(collectionAddr, CollectionAbi, details.signer) as any as Collection
    collectionContract.connect(details.signer)
    const boosterAddr = await collectionContract.getBooster()
    const boosterContract = await new ethers.Contract(boosterAddr, BoosterAbi, details.signer) as any as Booster
    boosterContract.connect(details.signer)
    boosterContract.on('BoosterResult', (adr: string, cards: string[]) => {
        console.log(adr, cards)
    })
    await collectionContract.buyAndOpenBooster()

}

export async function getSetMap(wallet: {
    details: ethereum.Details;
    contract: Main;
}) {
    const { details, contract } = wallet
    const nbSets = await contract.getNbCollections()
    let out: Map<number, string> = new Map()
    for (let i = 0; i < nbSets; i++) {
        const collectionAddr = await contract.getCollectionFromId(i)
        const collectionContract = await new ethers.Contract(collectionAddr, CollectionAbi, details.signer) as any as Collection
        collectionContract.connect(details.signer)
        const name = await collectionContract.name()
        out.set(i, name)
    }
    return out
}


export function addToMarketplace(cardId: String, AcceptedCards: String[]) {

    const card = {
        cardId, AcceptedCards
    }

    console.log(AcceptedCards)

}

export function getMarketPlaceCards() {
    const card1 = new Map();
    card1.set("sv2-2", ["sv2-5", "sv2-6", "sv2-7"]);

    const card2 = new Map();
    card2.set("sv2-9", ["sv2-10", "sv2-11", "sv2-12"]);

    return [card1, card2];
}

