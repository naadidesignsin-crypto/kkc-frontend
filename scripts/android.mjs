import { build } from 'vite';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
const root=fileURLToPath(new URL('../',import.meta.url));
process.chdir(root);
const target=process.argv[2]||'local';
if(!['local','prod'].includes(target))throw new Error('Choose local or prod.');
const run=(args)=>{const result=spawnSync(process.execPath,args,{cwd:root,stdio:'inherit',env:process.env});if(result.status!==0)process.exit(result.status||1)};
run(['node_modules/typescript/bin/tsc','-p','tsconfig.json']);
process.env.VITE_APP_SHELL='true';
process.env.VITE_REGISTRATION_ENV=target;
await build({mode:target==='local'?'development':'production',build:{outDir:'dist-android'}});
run(['node_modules/@capacitor/cli/bin/capacitor','sync','android']);
console.log('Android project prepared with '+target+' registrations.');
if(process.argv.includes('--apk')){
 const sdk=process.env.ANDROID_HOME||process.env.ANDROID_SDK_ROOT;
 if(!sdk&&!existsSync(resolve(root,'android/local.properties')))throw new Error('Install Android Studio and its Android SDK, then open the android folder once before building an APK.');
 const result=spawnSync(process.platform==='win32'?'gradlew.bat':'./gradlew',['assembleDebug'],{cwd:resolve(root,'android'),stdio:'inherit',shell:process.platform==='win32'});
 if(result.status!==0)process.exit(result.status||1);
}
