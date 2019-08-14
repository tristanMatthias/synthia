import { css } from 'lit-element';
export default css`:host{--form-columns: 1;display:grid;box-sizing:border-box;grid-template-columns:repeat(var(--form-columns), 1fr)}::slotted(label){margin-bottom:0.5rem;font-size:1.5rem;letter-spacing:0.1rem}::slotted(*){grid-column:span 1}
`;
