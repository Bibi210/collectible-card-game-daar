import express from "express"
import cors from "cors"
import { Contract } from "ethers"
import { HardhatRuntimeEnvironment } from "hardhat/types/runtime";
import { PokemonTCG } from "pokemon-tcg-sdk-typescript";

import type { Main } from "$/Main"
import type { Collection } from "$/Collection"
import * as crypto from 'crypto';

let mainContract_GLB: Main;
let superAdmin_GLB: string;
let hre_GLB: HardhatRuntimeEnvironment;
const nbCardsPerBooster = 5;

const app = express()
app.use(cors())

async function getContract(contractName: string, address: string) {
    const factory = await hre_GLB.ethers.getContractFactory(contractName);
    const contract = await factory.attach(address);
    return contract;
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function createCollections() {
    const sets = await PokemonTCG.getAllSets();
    const info = sets.map((set) => {
        const nbCards = PokemonTCG.findCardsByQueries({ q: `set.id:${set.id}` }).then((cards) => cards.length)
        return {
            name: set.name,
            symbol: set.id,
            nbCards: nbCards
        }

    })

    for (const set of info) {

        set.nbCards.then((nb) => {
            console.log("Create :", set.name)
            mainContract_GLB.createCollection(set.name, set.symbol, nb * nbCardsPerBooster)
        });

        await delay(1000)
    }
}

async function createBoosters(collectionID: number) {
    const collectionAddr = await mainContract_GLB.getCollectionFromId(collectionID);
    const collectionContract = (await getContract("Collection", collectionAddr)) as any as Collection;
    const collectionName = await collectionContract.name();
    console.log("collectionName", collectionName);
}


function startServer(mainContract: Contract, superAdmin: string, _hre: HardhatRuntimeEnvironment) {
    mainContract_GLB = mainContract as any
    superAdmin_GLB = superAdmin
    hre_GLB = _hre;
    createCollections();
    app.listen(3000, () => {
        console.log("BACKEND started on port 3000")
    })
}

export default app
export { startServer }