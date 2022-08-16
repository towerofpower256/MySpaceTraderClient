export default function updateMarketData(mdContext, locationSymbol, newMD) {
    let md = mdContext.find(md => md.location === locationSymbol);
    if (md) {
        md.updatedAt = new Date();
        md.goods = newMD;
    } else {
        md.push({
            location: locationSymbol,
            updatedAt: new Date(),
            goods: newMD
        });
    }
    
}