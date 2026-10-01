import 'server-only'
export type SearchHit={id:string;version:number;type:'article'|'post';title:string;snippet:string;score:number;href:string}
export type SearchResult={hits:SearchHit[];nextOffset:number|null}
export async function search(params:URLSearchParams):Promise<{result?:SearchResult;error?:string}> {
 try {
  const response=await fetch(`${process.env.RAYCHI_API_URL??'http://127.0.0.1:8080'}/api/v1/public/search?${params}`,{cache:'no-store',signal:AbortSignal.timeout(5000)})
  if(response.status===400)return {error:'请输入 2～200 个字符的关键词。暂不支持单个汉字搜索。'}
  if(!response.ok)return {error:'搜索暂时不可用，请稍后重试。'}
  return {result:await response.json() as SearchResult}
 }catch{return {error:'搜索暂时不可用，请稍后重试。'}}
}
