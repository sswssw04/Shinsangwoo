const el=id=>document.getElementById(id);
const prices={BASIC:9900,PLUS:14900};
function closeModal(){el('modal').classList.remove('open')}
// ▼ 입금 계좌 정보 (여기만 바꾸면 결제창에 반영됩니다)
const BANK={name:'KB국민은행',account:'937702-01-768311',holder:'신상우'};
function copyAccount(btn){
 const text=BANK.account.replace(/-/g,'');
 const done=()=>{btn.textContent='복사됨 ✓';setTimeout(()=>btn.textContent='계좌번호 복사',1500)};
 if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(done).catch(()=>prompt('계좌번호를 복사하세요',text))}
 else prompt('계좌번호를 복사하세요',text);
}
document.querySelectorAll('[data-plan]').forEach(btn=>btn.addEventListener('click',()=>{
 const plan=btn.dataset.plan;
 const order='SA-'+Math.random().toString(36).slice(2,8).toUpperCase();
 const amount=prices[plan].toLocaleString('ko-KR');
 el('modalBody').innerHTML=`<div class="eyebrow">CHECKOUT / 무통장 입금</div><h2>${plan} 이용권</h2>
 <div class="summary"><span>${plan} 월 이용권</span><strong>${amount}원</strong></div>
 <div class="bank"><div class="bank-row"><span>은행</span><b>${BANK.name}</b></div>
 <div class="bank-row"><span>계좌번호</span><b class="bank-num">${BANK.account}</b></div>
 <div class="bank-row"><span>예금주</span><b>${BANK.holder}</b></div>
 <div class="bank-row"><span>주문번호</span><b>${order}</b></div>
 <button class="btn alt" id="copyAcc" style="width:100%;margin-top:12px">계좌번호 복사</button></div>
 <p class="small muted">입금자명 뒤에 주문번호를 함께 적어 주세요. SHADOW ARENA는 과제용 프로토타입으로, 유료 기능은 아직 개발 중입니다.</p>
 <div class="modal-actions"><button class="btn alt" id="cancelOrder">취소</button><button class="btn" id="makeOrder">입금 안내 확인</button></div>`;
 el('modal').classList.add('open');el('cancelOrder').onclick=closeModal;
 el('copyAcc').onclick=e=>copyAccount(e.currentTarget);
 el('makeOrder').onclick=()=>{
  try{localStorage.setItem('shadow-arena-order',JSON.stringify({plan,order,createdAt:new Date().toISOString()}))}catch(e){}
  el('modalBody').innerHTML=`<div class="eyebrow">ORDER RECEIVED</div><h2 style="color:var(--cyan)">✓ 주문 접수 완료</h2><p>선택한 상품: <b>${plan}</b> · ${amount}원<br>주문번호: <b>${order}</b></p><p class="muted small">${BANK.name} ${BANK.account} (예금주 ${BANK.holder})</p><div class="modal-actions"><button class="btn alt" id="closeDone">닫기</button><a class="btn" href="#app" id="goApp">앱 체험하기</a></div>`;
  el('closeDone').onclick=closeModal;el('goApp').onclick=closeModal;
 };
}));
el('modal').addEventListener('click',e=>{if(e.target===el('modal'))closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
const missions=[['JAB → CROSS → DUCK',5],['JAB → JAB → CROSS',3],['CROSS → HOOK → DUCK',8]];let selected=0,score=0;
function showMission(){const [name,pts]=missions[selected];el('mission').textContent=name;el('complete').textContent=`미션 완료 (+${pts})`}
el('next').onclick=()=>{selected=(selected+1)%missions.length;showMission();el('result').textContent='새로운 미션이 표시되었습니다.'};
el('complete').onclick=()=>{const pts=missions[selected][1];score+=pts;el('score').textContent=score+'점';el('result').textContent=`+${pts}점! 다음 미션에도 도전해 보세요.`};
el('reset').onclick=()=>{score=0;el('score').textContent='0점';el('result').textContent='점수를 초기화했습니다.'};
const video=el('video'),canvas=el('overlay'),ctx=canvas.getContext('2d');let stream=null,pose=null,active=false,frame=null,working=false;
function script(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
async function setupPose(){if(!window.Pose)await script('https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js');pose=new Pose({locateFile:f=>'https://cdn.jsdelivr.net/npm/@mediapipe/pose/'+f});pose.setOptions({modelComplexity:0,smoothLandmarks:true,minDetectionConfidence:.55,minTrackingConfidence:.55});pose.onResults(({poseLandmarks:lm})=>{
 const w=video.videoWidth,h=video.videoHeight;if(!w||!h)return;canvas.width=w;canvas.height=h;ctx.clearRect(0,0,w,h);
 if(!lm){el('poseState').textContent='사람 인식 대기';return}
 const connections=[[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[25,27],[24,26],[26,28]];
 ctx.lineWidth=4;ctx.strokeStyle='#39e2f1';for(const [a,b] of connections){const p=lm[a],q=lm[b];if(p.visibility>.5&&q.visibility>.5){ctx.beginPath();ctx.moveTo(p.x*w,p.y*h);ctx.lineTo(q.x*w,q.y*h);ctx.stroke()}}
 ctx.fillStyle='#ec62a8';for(const p of lm){if(p.visibility>.6){ctx.beginPath();ctx.arc(p.x*w,p.y*h,5,0,2*Math.PI);ctx.fill()}}el('poseState').textContent='관절 추적 중';
 })}
async function loop(){if(!active||!pose||!stream)return;if(!working&&video.readyState>=2){working=true;try{await pose.send({image:video})}catch(e){el('poseState').textContent='추적 오류'}finally{working=false}}if(active)frame=requestAnimationFrame(loop)}
function stopCamera(){active=false;if(frame)cancelAnimationFrame(frame);if(stream){stream.getTracks().forEach(x=>x.stop());stream=null}video.srcObject=null;ctx.clearRect(0,0,canvas.width,canvas.height);el('placeholder').style.display='block';el('status').textContent='● CAMERA OFFLINE';el('camState').textContent='미연결';el('poseState').textContent='대기 중';el('start').disabled=false;el('stop').disabled=true}
el('start').onclick=async()=>{if(stream)return;if(!navigator.mediaDevices?.getUserMedia){el('result').textContent='카메라 접근에는 HTTPS 또는 localhost 접속이 필요합니다. README를 참고하세요.';return}
 try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});video.srcObject=stream;await video.play();el('placeholder').style.display='none';el('status').textContent='● CAMERA ONLINE';el('camState').textContent='연결됨';el('start').disabled=true;el('stop').disabled=false;el('poseState').textContent='모델 로딩';el('result').textContent='관절 인식 모델을 불러오는 중입니다.';
 try{await setupPose();active=true;loop();el('result').textContent='관절 추적을 시작했습니다. 미션을 따라 해 보세요!'}catch(e){el('poseState').textContent='모델 연결 실패';el('result').textContent='카메라 연결 성공. 관절 인식 모델 CDN 로드 실패: 인터넷 연결을 확인해 주세요.'}
 }catch(e){el('result').textContent='카메라 접근 실패. 브라우저 권한을 확인해 주세요.';stopCamera()}};
el('stop').onclick=stopCamera;window.addEventListener('pagehide',stopCamera);

// 모바일 메뉴
const nav=el('nav'),menuBtn=el('menuBtn');
menuBtn.onclick=()=>{const o=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',o);menuBtn.textContent=o?'✕':'☰'};
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuBtn.setAttribute('aria-expanded',false);menuBtn.textContent='☰'}));
