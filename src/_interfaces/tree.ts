import { Link } from './links';
import { Node } from './nodes';

export interface Tree {
  links: Array < Link >;
  nodes: Array < Node >;
}
