
import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

import type { Main } from "$/Main"
import type { Collection } from "$/Collection"
import type { MarketPlace } from "$/MarketPlace"


async function getContract<T>(hre: HardhatRuntimeEnvironment, contractName: string, address: string): Promise<T> {
    const factory = await hre.ethers.getContractFactory(contractName);
    factory.attach(address);
    const contract = factory.attach(address) as T;
    return contract;
}


async function createCollections(hre: HardhatRuntimeEnvironment, mainContract: Main) {
    const sets = await PokemonTCG.getAllSets()
    for (const set of sets) {
        const cards = await PokemonTCG.findCardsByQueries({ q: `set.id:${set.id}` });
        const cardsIDS = cards.map(card => card.id)
        await mainContract.createCollection(set.id, set.name, cardsIDS)
        const setAddr = await mainContract.getCollectionFromName(set.id)
        const CollectionContract = await getContract<Collection>(hre, "Collection", setAddr)
        CollectionContract.transferOwnership(CollectionContract.getBooster());
        const name = await CollectionContract.symbol()
        console.log("CollectionContract: ", name)
    }
}

async function setEnv(mainContract: any, hre: HardhatRuntimeEnvironment) {
    await createCollections(hre, mainContract as Main)
}

export { setEnv } 
