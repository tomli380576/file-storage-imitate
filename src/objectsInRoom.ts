import * as THREE from 'three';
import { Group, Mesh, Vector3 } from 'three';

export interface BoxDimensions {
    width: number,
    height: number,
    depth: number
}

export class ObjectsInRoom {
    closetDimensions: BoxDimensions = {
        "width": 7,
        "height": 20,
        "depth": 4
    }

    railDimensions: BoxDimensions = {
        "width": 5,
        "height": 1,
        "depth": 100
    }

    constructor() {

    }

    computeGroupCenter(group: THREE.Group): Vector3 {
        let center = new THREE.Vector3();
        let children = group.children;
        let count = children.length;
        for (let i = 0; i < count; i++) {
            center.add(children[i].position);
        }
        center.divideScalar(count);
        return center;
    }

    makeCloset(): Mesh {
        return new THREE.Mesh(
            new THREE.BoxBufferGeometry(this.closetDimensions.width, this.closetDimensions.height, this.closetDimensions.depth), // width, height, depth
            new THREE.MeshLambertMaterial({ color: 0xc6c5c1 })
        )
    }

    makeRail(): Mesh {
        return new THREE.Mesh(
            new THREE.BoxBufferGeometry(this.railDimensions.width, this.railDimensions.height, this.railDimensions.depth), // width, height, depth
            new THREE.MeshLambertMaterial({ color: 0x333333 })
        )
    }

    makeClosetRow(count: number): Group {
        let closetRow = new THREE.Group();
        for (let i = 0; i < count; i++) {
            let closet = this.makeCloset();
            closet.position.x += i * (this.closetDimensions.width + 0.5);
            closetRow.add(closet);
        }
        closetRow.translateX(this.computeGroupCenter(closetRow).x * -1);
        closetRow.translateY(this.closetDimensions.height / 2);
        return closetRow;
    }
}


