/** Server-only answer rules. Country packs carry content, never completion authority. */
export type TravelRule={target?:string;choice?:string;route?:('up'|'right'|'down'|'left')[];dish?:string;preference?:string;tiles?:string[]};
export const travelRules:Record<string,Record<string,TravelRule>>={
 'jp-arrival':{'read-signs':{target:'signs'},'ask-staff':{choice:'ask'},'find-train':{target:'station'}},
 'jp-directions':{'read-map':{target:'map'},'ask-route':{choice:'bookshop'},'walk-route':{route:['up','right','up']}},
 'jp-food':{'read-menu':{target:'menu'},'ask-ingredients':{choice:'ingredients'},'inspect-ingredients':{target:'ingredients'},'place-order':{dish:'vegetable',preference:'no-egg'}},
 'jp-culture':{'look-gate':{target:'gate'},'look-shops':{target:'shops'},'ask-guide':{choice:'about'},'share-visit':{tiles:['i','enjoyed','gate','and','shops']}},
};
