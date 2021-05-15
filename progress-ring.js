import { LitElement, html, css } from 'lit'

class ProgressRing extends LitElement {
  #normalizedRadius
  #circumference
  #strokeDasharray
  #strokeDashoffset
  static get styles () {
    return css`
      :host {
        /* custom vars
          --stroke-color
        */
        display: inline-block;
      }

      .content {
        position: relative;
        text-align: center;
      }

      .foodprint-ring__circle {
        opacity: var(--footprint-opacity);
        stroke: var(--footprint-stroke-color);
      }

      .progress-ring__circle {
        fill: var(--bk-color);
        stroke: var(--progress-stroke-color);
        opacity: var(--progress-opacity);
        /* One particular thing about stroke-dashoffset, its starting point 
          is vertically centered and horizontally tilted to the right. It’s 
          necessary to negatively rotate the circle to get the desired effect. */
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
        /* by transitioning the property we will get the animation feel */
        transition: stroke-dashoffset 0.35s;
      }

      p {
        position: absolute;
        bottom: 2.5rem;
        left: 0.8rem;
        right: 0;
        margin-left: auto;
        margin-right: auto;
      }
    `
  }

  static get properties () {
    return {
      color: String,
      radius: Number,
      progress: Number,
      stroke: Number
    }
  }

  connectedCallback () {
    super.connectedCallback()
    this.#normalizedRadius = this.radius - this.stroke * 2
    this.#circumference = this.#normalizedRadius * 2 * Math.PI
    this.#strokeDasharray = `${this.#circumference} ${this.#circumference}`
    this.#strokeDashoffset = 
        this.#circumference - this.progress / 100 * this.#circumference
  }

  update (changed) {
    // handle the progress updated
    if (changed.has('progress')) {
      this.#strokeDashoffset = 
        this.#circumference - this.progress / 100 * this.#circumference
    }
    super.update()
  }

  render () {
    return html`
    <div class="content">
      <svg class="progress-ring" 
        height=${this.radius * 2} 
        width=${this.radius * 2} >
        <circle 
          class="foodprint-ring__circle" 
          stroke-width=${this.stroke}
          fill="transparent"
          r=${this.#normalizedRadius}
          cx=${this.radius}
          cy=${this.radius} />
        <circle 
          class="progress-ring__circle"
          stroke-width=${this.stroke}
          r=${this.#normalizedRadius}
          cx=${this.radius}
          cy=${this.radius}
          stroke-dasharray=${this.#strokeDasharray}
          stroke-dashoffset=${this.#strokeDashoffset} />
      </svg>
      <p>${this.progress}%</p>
  </div>
    `
  }
}

customElements.define('progress-ring', ProgressRing)
