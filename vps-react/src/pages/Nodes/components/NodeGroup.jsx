import NodeItem from './NodeItem';
import styles from './NodeGroup.module.css';

function NodeGroup({ title, nodes }) {
    if (!nodes || nodes.length === 0) return null;

    return (
        <div className={styles.group}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.grid}>
                {nodes.map(node => (
                    <NodeItem key={node.id} node={node} />
                ))}
            </div>
        </div>
    );
}

export default NodeGroup;
