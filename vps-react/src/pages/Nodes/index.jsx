import { useState, useEffect, useMemo } from 'react';
import NodeGroup from './components/NodeGroup';
import styles from './Nodes.module.css';

function Nodes() {
    const [loading, setLoading] = useState(true);
    const [nodeGroups, setNodeGroups] = useState([]);
    const [filter, setFilter] = useState('all');
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        // 模拟获取节点数据
        const fetchNodes = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));

            setNodeGroups([
                {
                    id: 'hk',
                    title: '🇭🇰 中国香港',
                    region: '香港',
                    nodes: [
                        { id: 1, name: '香港 A1 [IEPL]', flag: '🇭🇰', online: true, load: 45, ping: 35, tags: ['Netflix', 'Disney+'] },
                        { id: 2, name: '香港 A2 [IEPL]', flag: '🇭🇰', online: true, load: 60, ping: 38, tags: ['Netflix'] },
                        { id: 3, name: '香港 B1 [BGP]', flag: '🇭🇰', online: true, load: 85, ping: 45, tags: [] },
                    ]
                },
                {
                    id: 'jp',
                    title: '🇯🇵 日本东京',
                    region: '日本',
                    nodes: [
                        { id: 4, name: '日本 A1 [Softbank]', flag: '🇯🇵', online: true, load: 30, ping: 65, tags: ['Netflix', 'AbemaTV'] },
                        { id: 5, name: '日本 A2 [IIJ]', flag: '🇯🇵', online: true, load: 40, ping: 70, tags: ['DMM'] },
                    ]
                },
                {
                    id: 'us',
                    title: '🇺🇸 美国洛杉矶',
                    region: '美国',
                    nodes: [
                        { id: 6, name: '美国 A1 [CN2 GIA]', flag: '🇺🇸', online: true, load: 25, ping: 140, tags: ['Netflix', 'HBO'] },
                        { id: 7, name: '美国 A2 [9929]', flag: '🇺🇸', online: true, load: 35, ping: 150, tags: ['Disney+'] },
                        { id: 8, name: '美国 B1 [4837]', flag: '🇺🇸', online: false, load: 0, ping: 0, tags: ['维护中'] },
                    ]
                },
                {
                    id: 'sg',
                    title: '🇸🇬 新加坡',
                    region: '新加坡',
                    nodes: [
                        { id: 9, name: '新加坡 A1 [CN2]', flag: '🇸🇬', online: true, load: 55, ping: 80, tags: ['Netflix'] },
                    ]
                }
            ]);
            setLoading(false);
        };

        fetchNodes();
    }, []);

    const filteredGroups = useMemo(() => {
        let groups = nodeGroups;

        // Filter by region
        if (filter !== 'all') {
            groups = groups.filter(group => group.region === filter);
        }

        // Filter by search keyword
        if (searchKeyword.trim()) {
            const keyword = searchKeyword.toLowerCase();
            groups = groups.map(group => ({
                ...group,
                nodes: group.nodes.filter(node =>
                    node.name.toLowerCase().includes(keyword) ||
                    node.tags.some(tag => tag.toLowerCase().includes(keyword))
                )
            })).filter(group => group.nodes.length > 0);
        }

        return groups;
    }, [nodeGroups, filter, searchKeyword]);

    if (loading) {
        return (
            <div className={styles.loading}>
                <i className="fas fa-spinner fa-spin"></i>
                <span>加载节点列表中...</span>
            </div>
        );
    }

    return (
        <div className={styles.nodesPage}>
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <div>
                        <h1 className={styles.title}>
                            <i className="fas fa-server" style={{ color: 'var(--primary-color)' }}></i>
                            节点列表
                        </h1>
                        <p className={styles.subtitle}>
                            实时监控所有节点状态，建议选择延迟较低的节点使用
                        </p>
                    </div>
                    <div className={styles.actions}>
                        <div className={styles.searchBox}>
                            <i className="fas fa-search"></i>
                            <input
                                type="text"
                                placeholder="搜索节点..."
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.filterBar}>
                    <button
                        className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        全部
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === '香港' ? styles.active : ''}`}
                        onClick={() => setFilter('香港')}
                    >
                        香港
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === '日本' ? styles.active : ''}`}
                        onClick={() => setFilter('日本')}
                    >
                        日本
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === '美国' ? styles.active : ''}`}
                        onClick={() => setFilter('美国')}
                    >
                        美国
                    </button>
                    <button
                        className={`${styles.filterBtn} ${filter === '新加坡' ? styles.active : ''}`}
                        onClick={() => setFilter('新加坡')}
                    >
                        新加坡
                    </button>
                </div>
            </div>

            <div className={styles.content}>
                {filteredGroups.length > 0 ? (
                    filteredGroups.map(group => (
                        <NodeGroup key={group.id} title={group.title} nodes={group.nodes} />
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <i className="fas fa-server"></i>
                        <p>未找到匹配的节点</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Nodes;
