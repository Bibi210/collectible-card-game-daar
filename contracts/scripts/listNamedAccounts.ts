import { task } from "hardhat/config";

task("list-named-accounts", "Prints the list of named accounts", async (_, hre) => {
  const namedAccounts = await hre.getNamedAccounts();
  console.log(namedAccounts);
});
