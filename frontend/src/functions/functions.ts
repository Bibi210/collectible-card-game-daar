import * as ethereum from '../lib/ethereum'
import type { Main } from '../../../typechain/src/Main'
import type { Collection } from '../../../typechain/src/Collection'
import type { Booster } from '../../../typechain/src/Booster'
import type { MarketPlace } from '../../../typechain/src/MarketPlace'
import { ethers } from 'ethers'
import CollectionAbi from '@/abis/Collection.json'
import BoosterAbi from '@/abis/Booster.json'
import MarketPlaceAbi from '@/abis/MarketPlace.json'
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";


export async function getContract<T>(addr: Promise<string>, abi: ethers.ContractInterface, signer: ethers.providers.JsonRpcSigner | undefined) {
    const contract = new ethers.Contract(await addr, abi, signer)
    if (signer)
        contract.connect(signer)
    return contract as any as T
}


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
    return idCard
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


type CardStruct = {
    uri: string;
    acceptedCurrencies: string[];
    owner: string;
    spotId: number
};

export async function uriToCollectionId(wallet: {
    details: ethereum.Details;
    contract: Main;
}, uri: string) {
    const { details, contract } = wallet;
    const card = await PokemonTCG.findCardByID(uri)
    const set = card.set.name
    return contract.getCollectionIdFromName(set)
}

export async function getMarketPlaceCards(wallet: {
    details: ethereum.Details;
    contract: Main;
}): Promise<CardStruct[]> {
    const { details, contract } = wallet;
    const MarketPlace = await getContract<MarketPlace>(contract.getMarketPlace(), MarketPlaceAbi, details.signer)
    const market = await MarketPlace.seeMarketPlace()
    const cards = market.map((card) => {
        return {
            uri: card.id,
            acceptedCurrencies: card.acceptedCurrencies,
            owner: card.owner,
            spotId: card.spotId
        }
    })
    return cards
}


export async function addToMarketplace(wallet: {
    details: ethereum.Details;
    contract: Main;
}, cardId: string, AcceptedCards: string[]) {
    const { details, contract } = wallet;
    const MarketPlace = await getContract<MarketPlace>(contract.getMarketPlace(), MarketPlaceAbi, details.signer)
    uriToCollectionId(wallet, cardId).then((collectionId) => {
        MarketPlace.sellCard(collectionId, cardId, AcceptedCards)
    })
}

export async function removeFromMarketplace(wallet: {
    details: ethereum.Details;
    contract: Main;
}, spotId: number) {
    const { details, contract } = wallet;
    const MarketPlace = await getContract<MarketPlace>(contract.getMarketPlace(), MarketPlaceAbi, details.signer)
    MarketPlace.unSellCard(spotId)
}


export async function buyFromMarketplace(wallet: {
    details: ethereum.Details;
    contract: Main;
}, spot: CardStruct, currency: string) {
    const { details, contract } = wallet;
    const MarketPlace = await getContract<MarketPlace>(contract.getMarketPlace(), MarketPlaceAbi, details.signer)
    MarketPlace.buyCard(spot.spotId, currency, await contract.getCollectionIdFromName(currency))
}