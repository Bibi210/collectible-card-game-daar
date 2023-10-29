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
        console.log("CollectionContract: ", name)
    }
}

async function testBooster(collectionId: number) {
    const setAddr = await mainContract_GLB.getCollectionFromId(collectionId)
    const CollectionContract = await getContract<Collection>("Collection", setAddr)


    await CollectionContract.buyBooster()
    const boosters = await CollectionContract.userBoosters()
    console.log("boosters before: ", boosters)
    await CollectionContract.openBooster()
    const boostersAfter = await CollectionContract.userBoosters()
    console.log("boosters after: ", boostersAfter)
    const cards = await CollectionContract.userCards()
    console.log("cards: ", cards)

}




async function setEnv(mainContract: Contract, superAdmin: string, _hre: HardhatRuntimeEnvironment) {
    mainContract_GLB = mainContract as any
    superAdmin_GLB = superAdmin
    hre_GLB = _hre;
    await createCollections()
    testBooster(0)
}

export { setEnv } 