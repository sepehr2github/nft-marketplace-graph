import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  ItemCanceled as ItemCanceledEvent,
  ItemListed as ItemListedEvent,
  itemBought as itemBoughtEvent,
} from "../generated/NFTMarketplace/NFTMarketplace";
import {
  ItemCanceled,
  ItemListed,
  ItemBought,
  ActiveItem,
} from "../generated/schema";

export function handleItemCanceled(event: ItemCanceledEvent): void {
  let itemCanceled = ItemCanceled.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeItems = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );

  if (!itemCanceled) {
    itemCanceled = new ItemCanceled(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }

  itemCanceled.seller = event.params.seller;
  itemCanceled.nftAddress = event.params.nftAddress;
  itemCanceled.tokenId = event.params.tokenId;
  activeItems!.buyer = Address.fromString(
    "0x000000000000000000000000000000000000dEaD"
  );

  itemCanceled.save();
  activeItems!.save();
}

export function handleItemListed(event: ItemListedEvent): void {
  let itemListed = ItemListed.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeItems = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );

  if (!itemListed) {
    itemListed = new ItemListed(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }
  itemListed.seller = event.params.seller;
  itemListed.nftAddress = event.params.nftAddress;
  itemListed.tokenId = event.params.tokenId;
  itemListed.price = event.params.price;

  if (!activeItems) {
    activeItems = new ActiveItem(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );
  }

  activeItems.seller = event.params.seller;
  activeItems.nftAddress = event.params.nftAddress;
  activeItems.tokenId = event.params.tokenId;
  activeItems.price = event.params.price;

  activeItems.buyer = Address.fromString(
    "0x0000000000000000000000000000000000000000"
  );

  itemListed.save();
  activeItems.save();
}

export function handleitemBought(event: itemBoughtEvent): void {
  // save that event on our graph
  // update our activeListItem
  let itemBought = ItemBought.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  let activeItems = ActiveItem.load(
    getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
  );
  if (!itemBought) {
    itemBought = new ItemBought(
      getIdFromEventParams(event.params.tokenId, event.params.nftAddress)
    );

    itemBought.buyer = event.params.buyer;
    itemBought.tokenId = event.params.tokenId;
    itemBought.nftAddress = event.params.nftAddress;
    activeItems!.buyer = event.params.buyer;

    itemBought.save();
    activeItems!.save();
  }
}

function getIdFromEventParams(tokenId: BigInt, nftAddress: Address): string {
  return tokenId.toHexString() + nftAddress.toHexString();
}
