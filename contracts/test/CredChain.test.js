const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CredChain Smart Contract", function () {
  let CredChain, credChain, owner, institution, student, externalUser;

  beforeEach(async function () {
    [owner, institution, student, externalUser] = await ethers.getSigners();
    CredChain = await ethers.getContractFactory("CredChain");
    credChain = await CredChain.deploy();
    await credChain.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct deployer as contract owner", async function () {
      expect(await credChain.owner()).to.equal(owner.address);
    });
  });

  describe("Institution Governance", function () {
    it("Should allow the owner to authorize an institution", async function () {
      await expect(credChain.connect(owner).addInstitution(institution.address))
        .to.emit(credChain, "InstitutionAdded")
        .withArgs(institution.address);
      
      expect(await credChain.authorizedInstitutions(institution.address)).to.be.true;
    });

    it("Should reject unauthorized users from issuing credentials", async function () {
      const sampleIpfs = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
      const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("proof"));

      await expect(
        credChain.connect(externalUser).issueCredential(
          student.address,
          sampleIpfs,
          "B.Tech Computer Science",
          sampleHash
        )
      ).to.be.revertedWith("Not an authorized institution");
    });
  });

  describe("Credential Issuance", function () {
    beforeEach(async function () {
      await credChain.connect(owner).addInstitution(institution.address);
    });

    it("Should successfully mint an academic credential asset", async function () {
      const sampleIpfs = "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco";
      const sampleHash = ethers.keccak256(ethers.toUtf8Bytes("proof"));

      await expect(
        credChain.connect(institution).issueCredential(
          student.address,
          sampleIpfs,
          "B.Tech Computer Science",
          sampleHash
        )
      ).to.emit(credChain, "CredentialIssued");

      expect(await credChain.balanceOf(student.address)).to.equal(1n);
    });
  });
});