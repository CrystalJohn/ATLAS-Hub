import fs from "node:fs";import path from "node:path";
const root=path.resolve("docs/content-authoring/content-02b-review");
const j=n=>JSON.parse(fs.readFileSync(path.join(root,n),"utf8"));
const s=j("TOKYO-scenarios.r2.json"),c=j("TOKYO-tower-candidates.r2.json");
let text="# CONTENT-02B proposed r2 review text\n\nDRAFT · AI correction proposal · no human signoff. This view is generated from r2 JSON, not a replacement for the original r1 files. Unresolved issues remain in the item matrix.\n\n";
for(const x of s){
 text+="## "+x.id+" — "+x.contentRevision+"\n\n";
 for(const field of ["base","retry"])text+="### "+x[field].id+"\n\nEN: "+x[field].en+"\n\nVI candidate: "+x[field].vi+"\n\n";
 text+="Feedback EN: "+x.feedback.en+"\n\nFeedback VI: "+x.feedback.vi+"\n\n";
}
text+="# Proposed Tower prompts and choices\n\nKeys remain in the separate private file.\n\n";
for(const x of c)for(const v of x.variants){
 text+="## "+v.id+"\n\n"+v.stemEn+"\n\nVI candidate: "+v.stemViCandidate+"\n\n"+v.options.map(o=>"- "+o.id+": "+o.text).join("\n")+"\n\n";
}
fs.writeFileSync(path.join(root,"CONTENT-02B-r2-review-text.md"),text);
const original=JSON.parse(fs.readFileSync(path.resolve(root,"../content-02a-tokyo/TOKYO-scenarios.json"),"utf8").replace(/^\uFEFF/,""));
const originalC=JSON.parse(fs.readFileSync(path.resolve(root,"../content-02a-tokyo/TOKYO-tower-candidates.json"),"utf8").replace(/^\uFEFF/,""));
const diffs=[];
function compare(a,b,p){
 if(JSON.stringify(a)===JSON.stringify(b))return;
 if(a && b && typeof a==="object" && typeof b==="object" && !Array.isArray(a) && !Array.isArray(b)){
  for(const key of new Set([...Object.keys(a),...Object.keys(b)]))compare(a[key],b[key],p+"."+key);
 }else diffs.push({path:p,before:a===undefined?null:a,after:b===undefined?null:b});
}
original.forEach((a,i)=>compare(a,s[i],a.id));
originalC.forEach((a,i)=>compare(a,c[i],a.id));
fs.writeFileSync(path.join(root,"CONTENT-02B-full-revision-diff.json"),JSON.stringify(diffs,null,2)+"\n");
console.log("Saved readable proposed r2 text and "+diffs.length+" explicit field-level revision changes.");
