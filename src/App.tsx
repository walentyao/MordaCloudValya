import { useCallback, useEffect, useState } from 'react';
import { getChat, getChats, getRoles } from './api/gpt.api';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { FloatLabel } from 'primereact/floatlabel';
import { Button } from 'primereact/button';
import { Role } from './types/types';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import cls from './App.module.css';

function App() {
  const [tab, setTab] = useState(0);
  const [roles, setRoles] = useState<Role[]>([]);
  const [currentRole, setCurrentRole] = useState<Role>();
  const [search, setSearch] = useState('');
  const [responeChat, setResponeChat] = useState('');
  const [chats, setChats] = useState<
    {
      requestText: string;
      answeredText: string;
      userRole: string;
    }[]
  >();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRoles().then((res) => {
      if (res) {
        setRoles(res.data.map((value) => ({ name: value, code: value })));
        setCurrentRole({ name: res.data[0], code: res.data[0] });
      }
    });
  }, []);

  const handleOnClick = useCallback(() => {
    setLoading(true);
    if (currentRole)
      getChat(search, currentRole.code).then((res) => {
        if (res) setResponeChat(res.data.translatedText);
        setLoading(false);
        getChats().then((res) => {
          if (res) setChats(res.data);
        });
      });
  }, [currentRole, search]);

  const handleClickListQueries = useCallback(() => {
    getChats().then((res) => {
      if (res) setChats(res.data);
    });
  }, []);

  return (
    <div className={cls.app}>
      <TabView
        activeIndex={tab}
        onTabChange={(event) => {
          if (event.index === 1) handleClickListQueries();
          setTab(event.index);
        }}
      >
        <TabPanel header="Запрос">
          <div className={cls.panel}>
            <div className={cls.search}>
              {roles && (
                <FloatLabel>
                  <Dropdown
                    id="role"
                    value={currentRole}
                    options={roles}
                    optionLabel="name"
                    onChange={(e) => setCurrentRole(e.value)}
                    className={cls.dropdowm}
                  />
                  <label htmlFor="role">Роль</label>
                </FloatLabel>
              )}
              <FloatLabel className={cls.textareaWrapper}>
                <InputTextarea
                  id="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cls.textarea}
                />
                <label htmlFor="search">Ваш запрос</label>
              </FloatLabel>
              <div className={cls.btns}>
                <Button
                  label="Отправить"
                  onClick={handleOnClick}
                  loading={loading}
                />
              </div>
            </div>
            {responeChat && <Card className={cls.result}>{responeChat}</Card>}
          </div>
        </TabPanel>
        <TabPanel header="Список запросов">
          <div className={cls.listRequests}>
            {chats?.map((chat, index) => (
              <Card
                className={cls.result}
                key={index}
              >
                <div className={cls.card}>
                  <span>Роль: {chat.userRole}</span>
                  <span>Запрос: {chat.requestText}</span>
                  <span>Ответ: {chat.answeredText}</span>
                </div>
              </Card>
            ))}
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
}

export default App;
