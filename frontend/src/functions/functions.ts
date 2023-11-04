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


export function getContract<T>(addr: string, abi: ethers.ContractInterface, signer: ethers.providers.JsonRpcSigner | undefined) {
    const contract = new ethers.Contract(addr, abi, signer)
    if (signer)
        contract.connect(signer)
    return contract as any as T
}


export async function getUserCards(wallet: {
    details: ethereum.Details;
    contract: Main;
}) {
    const { details, contract } = wallet
    const nbCollection = await contract.getNbCollections()
    let idCard: string[] = []
    for (let i = 0; i < nbCollection; i++) {
        const collectionContract = getContract<Collection>(await contract.getCollectionFromId(i), CollectionAbi, details.signer)
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
    const collectionContract = getContract<Collection>(collectionAddr, CollectionAbi, details.signer)
    const boosterAddr = await collectionContract.getBooster()
    const boosterContract = getContract<Booster>(boosterAddr, BoosterAbi, details.signer)
    boosterContract.on('BoosterResult', (adr: string, cards: string[]) => {
        console.log(adr, cards)
    })
    await collectionContract.buyAndOpenBooster()
    return collectionContract.getLastBooster()
}

export async function getSetMap(wallet: {
    details: ethereum.Details;
    contract: Main;
}) {
    const { details, contract } = wallet
    const nbSets = await contract.getNbCollections()
    let out: Map<string, number> = new Map()
    for (let i = 0; i < nbSets; i++) {
        const collectionContract = getContract<Collection>(await contract.getCollectionFromId(i), CollectionAbi, details.signer)
        const name = await collectionContract.name()
        out.set(name, i)
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
    const card = await PokemonTCG.findCardByID(uri)
    const set = card.set.name
    return wallet.contract.getCollectionIdFromName(set)
}

export async function getMarketPlaceCards(wallet: {
    details: ethereum.Details;
    contract: Main;
}): Promise<CardStruct[]> {
    const { details, contract } = wallet;
    const MarketPlace = getContract<MarketPlace>(await contract.getMarketPlace(), MarketPlaceAbi, details.signer)
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
    const MarketPlace = getContract<MarketPlace>(await contract.getMarketPlace(), MarketPlaceAbi, details.signer)
    uriToCollectionId(wallet, cardId).then((collectionId) => {
        MarketPlace.sellCard(collectionId, cardId, AcceptedCards)
    })
}

export async function removeFromMarketplace(wallet: {
    details: ethereum.Details;
    contract: Main;
}, spotId: number) {
    const { details, contract } = wallet;
    const MarketPlace = await getContract<MarketPlace>(await contract.getMarketPlace(), MarketPlaceAbi, details.signer)
    MarketPlace.unSellCard(spotId)
}


export async function buyFromMarketplace(wallet: {
    details: ethereum.Details;
    contract: Main;
}, spot: CardStruct, currency: string) {
    const { details, contract } = wallet;
    const MarketPlace = await getContract<MarketPlace>(await contract.getMarketPlace(), MarketPlaceAbi, details.signer)
    MarketPlace.buyCard(spot.spotId, currency, await contract.getCollectionIdFromName(currency))
}