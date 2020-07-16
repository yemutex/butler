import React, { useState, useEffect } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import Switch from '@material-ui/core/Switch';
import classNames from 'classnames';

import { getCurrentSession, getSessions } from '../util.js';

export default function SessionList(props) {
  const [items, setItems] = useState({});
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      const data = await getSessions();
      const curr = await getCurrentSession();
      if (!cancelled) {
        setItems(data);
        setCurrent(curr);
      }
    }
    fetchData();

    return () => {
      cancelled = true;
    };
  });

  const listItems = Object.entries(items).map(session => {
    const [id, data] = session;
    const name = data.name ? data.name : id;
    const count = data.tabs.length > 1 ?
      `${data.tabs.length} tabs` : `${data.tabs.length} tab`;
    const date = (new Date(data.timestamp)).toLocaleDateString();
    return (
      <li
        key={id}
        className={classNames({
          'session-item': true,
          'current': current === id
        })}
      >
        <Switch
          checked={current === id}
          disabled={current && current !== id}
          size="small"
          color="primary"
          onChange={() => { props.handleChange(id, session); }}
        />
        <div className="item-info">
          <p className="item-name" title={name}>{name}</p>
          <p className="item-detail" title={`${count}, created on ${date}`}>
            {count}, created on {date}
          </p>
        </div>
        <DeleteIcon
          className="item-control"
          onClick={() => { props.handleDelete(id); }}
        />
      </li>
    );
  });

  return (
    <div className="session-list">
      <header>Sessions</header>
      <ul className="catalog">{listItems}</ul>
      <button
        onClick={props.handleNew}
        className="anchor-button"
        disabled={current}
      >
        New Session
      </button>
    </div>
  );
}
