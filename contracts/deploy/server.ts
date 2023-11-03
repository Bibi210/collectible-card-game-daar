import { Contract } from "ethers"
import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

import type { Main } from "$/Main"
import type { Collection } from "$/Collection"
import type { MarketPlace } from "$/MarketPlace"


let mainContract_GLB: Main;
let superAdmin_GLB: string;
let hre_GLB: HardhatRuntimeEnvironment;


async function getContract<T>(contractName: string, address: string): Promise<T> {
    const factory = await hre_GLB.ethers.getContractFactory(contractName);
    factory.attach(address);
    const contract = factory.attach(address) as T;
    return contract;
}


async function createCollections() {
    const sets = await PokemonTCG.getAllSets()
    sets.splice(2, sets.length)

    const s = sets.map(async (set) => {
        const cards = await PokemonTCG.findCardsByQueries({ q: `set.id:${set.id}` });
        const cardsIDS = cards.map(card => card.id)
        await mainContract_GLB.createCollection(set.name, set.id, cardsIDS)
    })
    await Promise.all(s)
    for (const set of sets) {
        const setAddr = await mainContract_GLB.getCollectionFromName(set.name)
        const CollectionContract = await getContract<Collection>("Collection", setAddr)
        const name = await CollectionContract.name()
        const BoosterContract = await getContract<Collection>("Booster", await CollectionContract.getBooster())
        BoosterContract.on('BoosterResult', (owner, result) => {
            for (const card of result) {
                console.log("card: ", card)
                CollectionContract.safeMint(owner, card)
            }
        })
        console.log("CollectionContract: ", name)
    }

    const MarketPlaceContract = await getContract<MarketPlace>("MarketPlace", await mainContract_GLB.getMarketPlace())
    MarketPlaceContract.on('Exchange', (card: MarketPlace.ValidateTradeStruct, trade: MarketPlace.ValidateTradeStruct) => {
        mainContract_GLB.getCollectionFromId(card.collectionId).then((collectionAddr) => {
            getContract<Collection>("Collection", collectionAddr).then((CollectionContract) => {
                CollectionContract.transferFrom(card.owner, trade.owner, card.tokenId)
            })
        })

        mainContract_GLB.getCollectionFromId(trade.collectionId).then((collectionAddr) => {
            getContract<Collection>("Collection", collectionAddr).then((CollectionContract) => {
                CollectionContract.transferFrom(trade.owner, card.owner, trade.tokenId)
            })
        })
    })
}

async function sellCard() {
    const firstSet = await mainContract_GLB.getCollectionFromId(0)
    const CollectionContract = await getContract<Collection>("Collection", firstSet)
    const CollectionName = await CollectionContract.name()
    const firstCardRequest = await PokemonTCG.findCardsByQueries({ q: `set.name:${CollectionName}` });
    const firstCard = firstCardRequest[0]

    CollectionContract.safeMint(superAdmin_GLB, firstCard.id)
    const marketPlace = await mainContract_GLB.getMarketPlace();
    const MarketPlaceContract = await getContract<MarketPlace>("MarketPlace", marketPlace)
    await MarketPlaceContract.sellCard(firstCard.id, 0, [firstCard.id])
    console.log("MarketPlace :" + await MarketPlaceContract.seeMarketPlace())
    await MarketPlaceContract.buyCard(0, firstCard.id, 0)
}



async function setEnv(mainContract: Contract, superAdmin: string, _hre: HardhatRuntimeEnvironment) {
    mainContract_GLB = mainContract as any
    superAdmin_GLB = superAdmin
    hre_GLB = _hre;
    await createCollections()
    await sellCard()
}

export { setEnv } 