
import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

import type { Main } from "$/Main"
import type { Collection } from "$/Collection"
import type { MarketPlace } from "$/MarketPlace"
import type { Booster } from "$/Booster"
import { Contract } from "ethers";


async function getContract<T>(hre: HardhatRuntimeEnvironment, contractName: string, address: string): Promise<T> {
    const factory = await hre.ethers.getContractFactory(contractName);
    factory.attach(address);
    const contract = factory.attach(address) as T;
    return contract;
}


async function createCollections(hre: HardhatRuntimeEnvironment, mainContract: Main) {
    const sets = await PokemonTCG.getAllSets()
    sets.splice(25, sets.length)

    const s = sets.map(async (set) => {
        const cards = await PokemonTCG.findCardsByQueries({ q: `set.id:${set.id}` });
        const cardsIDS = cards.map(card => card.id)
        await mainContract.createCollection(set.id, set.name, cardsIDS)
        const setAddr = await mainContract.getCollectionFromName(set.id)
        const CollectionContract = await getContract<Collection>(hre, "Collection", setAddr)
        const BoosterContract = await getContract<Booster>(hre, "Booster", await CollectionContract.getBooster())
        BoosterContract.on('BoosterResult', (owner: string, result: string[]) => {
            for (const card of result) {
                console.log("Mint: ", card, "To: ", owner)
                CollectionContract.safeMint(owner, card)
            }
        })
        const name = await CollectionContract.symbol()
        console.log("CollectionContract: ", name)
    })
    await Promise.all(s)


    const MarketPlaceContract = await getContract<MarketPlace>(hre, "MarketPlace", await mainContract.getMarketPlace())
    MarketPlaceContract.on('Exchange', (card: MarketPlace.ValidateTradeStruct, trade: MarketPlace.ValidateTradeStruct) => {
        mainContract.getCollectionFromId(card.collectionId).then((collectionAddr) => {
            getContract<Collection>(hre, "Collection", collectionAddr).then((CollectionContract) => {
                CollectionContract.superTransferFrom(card.owner, trade.owner, card.tokenId)
            })
        })

        mainContract.getCollectionFromId(trade.collectionId).then((collectionAddr) => {
            getContract<Collection>(hre, "Collection", collectionAddr).then((CollectionContract) => {
                CollectionContract.superTransferFrom(trade.owner, card.owner, trade.tokenId)
            })
        })
    })
}

async function setEnv(mainContract: any, superAdmin: string, hre: HardhatRuntimeEnvironment) {
    await createCollections(hre, mainContract as Main)
}

export { setEnv } 
