import ts from 'typescript';

type Dependency={specifier:string;typeOnly:boolean;dynamic:boolean};
export function towerImportViolations(source:string,file:string):string[]{
 const normalized=file.replaceAll('\\','/');
 const server=normalized.startsWith('lib/atlas/');
 const localDraft=normalized==='lib/atlas/tower-local-draft.ts';
 const localRoute=normalized==='app/api/[...path]/route.ts';
 const dependencies:Dependency[]=[];
 const ast=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 function visit(node:ts.Node){
  if(ts.isImportDeclaration(node)&&ts.isStringLiteral(node.moduleSpecifier)){
   const clause=node.importClause;
   const bindings=clause?.namedBindings;
   const typeOnly=!!clause?.isTypeOnly||(!clause?.name&&!!bindings&&ts.isNamedImports(bindings)&&bindings.elements.length>0&&bindings.elements.every(e=>e.isTypeOnly));
   dependencies.push({specifier:node.moduleSpecifier.text,typeOnly,dynamic:false});
  }else if(ts.isExportDeclaration(node)&&node.moduleSpecifier&&ts.isStringLiteral(node.moduleSpecifier)){
   const clause=node.exportClause;
   const typeOnly=node.isTypeOnly||(!!clause&&ts.isNamedExports(clause)&&clause.elements.length>0&&clause.elements.every(e=>e.isTypeOnly));
   dependencies.push({specifier:node.moduleSpecifier.text,typeOnly,dynamic:false});
  }else if(ts.isImportEqualsDeclaration(node)&&ts.isExternalModuleReference(node.moduleReference)&&node.moduleReference.expression&&ts.isStringLiteral(node.moduleReference.expression)){
   dependencies.push({specifier:node.moduleReference.expression.text,typeOnly:node.isTypeOnly,dynamic:false});
  }else if(ts.isCallExpression(node)&&(node.expression.kind===ts.SyntaxKind.ImportKeyword||(ts.isIdentifier(node.expression)&&node.expression.text==='require'))){
   const arg=node.arguments[0];
   if(arg&&(ts.isStringLiteral(arg)||ts.isNoSubstitutionTemplateLiteral(arg)))dependencies.push({specifier:arg.text,typeOnly:false,dynamic:node.expression.kind===ts.SyntaxKind.ImportKeyword});
  }
  ts.forEachChild(node,visit);
 }
 visit(ast);
 return dependencies.flatMap(({specifier,typeOnly,dynamic})=>{
  if(/(?:c0-fixture-adapter|C0-question-bank)/.test(specifier))return localDraft?[]:['DRAFT fixture import: '+specifier];
  if(/tower-local-draft/.test(specifier))return localRoute&&dynamic?[]:['Local DRAFT runtime import: '+specifier];
  if(!server&&/(?:tower-engine|content\/tower)/.test(specifier)){
   // Only erased imports/re-exports from the DTO type module may cross into UI.
   if(typeOnly&&/content\/tower\/types(?:\.ts)?$/.test(specifier))return [];
   return ['Tower runtime import outside server: '+specifier];
  }
  return [];
 });
}

/** Evaluate the actual route's import condition without importing or running a server. */
export function localDraftRouteGate(source:string){
 const ast=ts.createSourceFile('route.ts',source,ts.ScriptTarget.Latest,true);
 let condition:ts.Expression|undefined;
 let draftImports=0;
 function visit(node:ts.Node){
  if(ts.isCallExpression(node)&&node.expression.kind===ts.SyntaxKind.ImportKeyword&&node.arguments[0]&&ts.isStringLiteral(node.arguments[0])&&node.arguments[0].text.includes('tower-local-draft')){
   draftImports++;
   const awaited=node.parent;
   const conditional=awaited?.parent;
   if(ts.isAwaitExpression(awaited)&&ts.isConditionalExpression(conditional)&&conditional.whenTrue===awaited&&conditional.whenFalse.kind===ts.SyntaxKind.Identifier&&conditional.whenFalse.getText(ast)==='undefined')condition=conditional.condition;
  }
  ts.forEachChild(node,visit);
 }
 visit(ast);
 if(draftImports!==1||!condition)throw new Error('Local DRAFT import must be the sole guarded conditional import');
 const evaluate=new Function('process','hostname','isTower','return !!('+condition.getText(ast)+');') as (process:{env:Record<string,string|undefined>},hostname:string,isTower:boolean)=>boolean;
 return (env:Record<string,string|undefined>,hostname:string,isTower:boolean)=>evaluate({env},hostname,isTower);
}
