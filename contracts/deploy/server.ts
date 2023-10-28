import { Contract } from "ethers"
import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

import type { Main } from "$/Main"
import type { Collection } from "$/Collection"


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

    sets.splice(10, sets.length)

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
        console.log("CollectionContract: ", name)
    }
}

async function testBooster(collectionId: number) {
    getContract<Collection>("Collection", await mainContract_GLB.getCollectionFromId(collectionId))
    const setAddr = await mainContract_GLB.getCollectionFromId(0)
    const CollectionContract = await getContract<Collection>("Collection", setAddr)
    await CollectionContract.buyBooster(superAdmin_GLB)
    const boosters = await CollectionContract.userBoosters(superAdmin_GLB)
    console.log("boosters before: ", boosters)
    await CollectionContract.openBooster()
    const cards = await CollectionContract.userCards(superAdmin_GLB)
    console.log("cards: ", cards)
    console.log("boosters after: ", boosters)

}




async function setEnv(mainContract: Contract, superAdmin: string, _hre: HardhatRuntimeEnvironment) {
    mainContract_GLB = mainContract as any
    superAdmin_GLB = superAdmin
    hre_GLB = _hre;
    await createCollections()
    testBooster(0)
}

export { setEnv } 