import { ApiPagingResult, useApi } from "@/app/api";
import { User } from "@/app/user-store";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Container, Pagination, Panel, Popover, Row, Toggle, Whisper, WhisperInstance } from "rsuite";

export default function Users() {
    const api = useApi();
    const [users, setUsers] = useState<ApiPagingResult<User>>({ total: 0, limit: 25, page: 1, values: [] });
    const [changes, setChanges] = useState<{ id: string, active: boolean }[]>([]);

    const [activePage, setActivePage] = useState(1);
    const [pageLimit, setPageLimit] = useState(25);

    const reload = async () => {
        const { success, body } = await api.get<ApiPagingResult<User>>(`/api/users?page=${activePage}&limit=${pageLimit}`);
        if (success && body) setUsers(body);
    }

    useEffect(() => { reload(); }, [activePage, pageLimit])

    const submitChanges = async () => {
        await api.post('/api/users/set-activity', changes);
        const map = changes.reduce<{ [key: string]: boolean }>((map, curr) => ({ ...map, [curr.id]: curr.active }), {});
        users.values.forEach(x => x.active = map[x.id] !== undefined ? map[x.id] : x.active);
        setUsers({ ...users })
        setChanges([]);
    }

    return <Container>
        {changes.length > 0 && <div className="mb">
            One or more users have been modified. <Button appearance="primary" onClick={submitChanges} size="sm">Save</Button>
        </div>}

        <Panel bodyFill style={{ padding: '5px 10px' }}>
            <Row>
                <Col md={6}><b>Username</b></Col>
                <Col md={6}><b>Active</b></Col>
            </Row>
        </Panel>
        <div className="mb">
            {users.values.map(user => <UserUpdateComponent user={user} changes={changes} setChanges={setChanges} key={user.id} />)}
        </div>
        <Pagination limit={pageLimit} total={users.total} activePage={activePage} onChangePage={setActivePage} onChangeLimit={setPageLimit} limitOptions={[10, 25, 50]}
            layout={['limit', '-', 'pager']} size="sm"
        />
    </Container>
}

function UserUpdateComponent({ user, changes, setChanges }: { user: User, changes: UserChange[], setChanges: (next: UserChange[]) => void }) {
    const whisperRef = useRef<WhisperInstance>(null);
    const [active, setActive] = useState(user.active);

    const onClick = () => {
        if (user.active == active && changes.find(x => x.id == user.id)) {
            setChanges(changes.filter(x => x.id != user.id));
        } else if (user.active !== active) {
            setChanges([...changes, { id: user.id, active }])
        }
        whisperRef.current?.close();
    }

    const popover = <Popover title="Edit active flag">
        <div className="mb"><b>{user.username}</b></div>
        <div className="mb">
            <Toggle defaultChecked={user.active} onChange={setActive}>Active</Toggle>
        </div>
        <div>
            <Button disabled={active == user.active} onClick={onClick} appearance="primary">Ok</Button>
        </div>
    </Popover>;

    return <Panel bodyFill bordered style={{ padding: '5px 10px' }} key={'user_' + user.id}>
        <Row>
            <Col md={6}>
                <Whisper placement="bottom" trigger="click" speaker={popover} style={{ cursor: 'pointer' }} ref={whisperRef}>
                    <span style={{ cursor: 'pointer' }}>{user.username}</span>
                </Whisper>
            </Col>
            <Col md={6}>{user.active ? 'True' : 'False'}</Col>
        </Row>
    </Panel>
}

interface UserChange {
    id: string;
    active: boolean;
}
