/* global axios */
const itemGlanceTemplate = document.querySelector("#diary-glance-template");
const diaryList = document.querySelector("#diaries");
const diaryShow = document.querySelector("#show-diary");
const diaryModify = document.querySelector("#modify-diary");

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});
let isShow = false;
let isModify = false;

async function main() {
  checkRender();
  setupEventListenersForAdd();
  setupEventListenersForView();
  try {
    const diaries = await getDiarys();
    diaries.forEach((diary) => renderDiary(diary));
  } catch (error) {
    alert("Failed to load diaries!");
  }
}
//檢測現在是要檢視/編輯，並正確顯示
function checkRender(){
  if(isShow){
    diaryList.style.display='none';
    diaryShow.style.display='';
    diaryModify.style.display='none';
  }
  else{
    diaryList.style.display='';
    diaryShow.style.display='none';
    diaryModify.style.display='none';
    setupEventListenersForAdd();
  }
  if(isModify){
    diaryList.style.display='none';
    diaryShow.style.display='none';
    diaryModify.style.display='';
  }
  else{
    diaryList.style.display='';
    diaryShow.style.display='none';
    diaryModify.style.display='none';
    setupEventListenersForAdd();
  }
}

function setupEventListenersForAdd(){
  const addDiaryButton = document.querySelector("#diary-add");
  addDiaryButton.addEventListener("click", () => {
    isModify = true;
    isShow = false;
    const setDate = document.querySelector("#modify-diary .date");
    setDate.value=formatTime();
  });
}

function setupEventListenersForView(){
  diaryList.forEach((diary)=>{
    diary.addEventListener("click",()=>{
      isShow=true;
      isModify=false;
      const setDate = document.querySelector("#show-diary .date");
      const setTag = document.querySelector("#show-diary .tag");
      const setMood = document.querySelector("#show-diary .mood");
      const setDisc = document.querySelector(".diary-description-show");
      setDate.value = diary.date;
      setTag.value = diary.tag;
      setMood.value = diary.mood;
      setDisc.value = diary.discription;
    })
  })
}

function modifyPage() {
  const confirmAddButton = document.querySelector("#confirm");
  const cancelButton = document.querySelector("#cancel");
  const diaryDate = document.querySelector("#modify-diary .date");
  const diaryTag = document.querySelector("#tag-form");
  const diaryMood = document.querySelector("#mood-form");
  const diaryDescriptionInput = document.querySelector(
    "#diary-description-input",
  );
  cancelButton.addEventListener("click",()=>{
    isShow=false;
    isModify=false;
  });
  confirmAddButton.addEventListener("click", async () => {
    const date = diaryDate.value;
    const description = diaryDescriptionInput.value;
    const tag = diaryTag.value;
    const mood = diaryMood.value;
    if (!description) {
      alert("Please enter a diary description!");
      return;
    }
    try {
      const diary = await createDiary({ description,date,tag,mood });
      renderDiary(diary);
    } catch (error) {
      alert("Failed to create diary!");
      return;
    }
    diaryDate.value="";
    diaryDescriptionInput.value = "";
  });
}

function renderDiary(diary) {
  const item = createDiaryElement(diary);
  diaryList.appendChild(item);
}

function createDiaryElement(diary) {
  const item = itemTemplate.content.cloneNode(true);
  const container = item.querySelector(".diary-item");
  container.id = diary.id;
  console.log(diary);
  const checkbox = item.querySelector(`input[type="checkbox"]`);
  checkbox.checked = diary.completed;
  checkbox.dataset.id = diary.id;
  const title = item.querySelector("p.diary-title");
  title.innerText = diary.title;
  const description = item.querySelector("p.diary-description");
  description.innerText = diary.description;
  const deleteButton = item.querySelector("button.delete-diary");
  deleteButton.dataset.id = diary.id;
  deleteButton.addEventListener("click", () => {
    deleteDiaryElement(diary.id);
  });
  return item;
}

async function deleteDiaryElement(id) {
  try {
    await deleteDiaryById(id);
  } catch (error) {
    alert("Failed to delete diary!");
  } finally {
    const diary = document.getElementById(id);
    diary.remove();
  }
}

async function getDiarys() {
  const response = await instance.get("/diaries");
  return response.data;
}

async function createDiary(diary) {
  const response = await instance.post("/diaries", diary);
  return response.data;
}

// eslint-disable-next-line no-unused-vars
async function updateDiaryStatus(id, diary) {
  const response = await instance.put(`/diaries/${id}`, diary);
  return response.data;
}

async function deleteDiaryById(id) {
  const response = await instance.delete(`/diaries/${id}`);
  return response.data;
}

function formatTime(date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份從0開始，所以要加1
  const day = date.getDate().toString().padStart(2, '0');
  const daysOfWeek = ['日', '一', '二', '三', '四', '五', '六'];
  const dayOfWeek = daysOfWeek[date.getDay()]; // 星期幾

  return `${year}/${month}/${day}(${dayOfWeek})`;
}

main();
