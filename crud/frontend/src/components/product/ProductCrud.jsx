import React, { Component } from "react";
import axios from "axios";
import Main from "../template/Main";

const headerProps = {
  icon: "products",
  title: "Produtos",
  subtitle:
    "Cadastro de produtos: incluir, listar, alterar, adicionar ao carrinho e excluir!",
};

const baseUrl = "http://localhost:3001/products";
const initialState = {
  product: { product: "", price: "" },
  list: [],
};

export default class ProductCrud extends Component {
  state = { ...initialState };

  componentWillMount() {
    axios(baseUrl).then((resp) => {
      this.setState({ list: resp.data });
    });
  }

  clear() {
    this.setState({ product: initialState.product });
  }

  save() {
    const product = this.state.product;
    const method = product.id ? "put" : "post";
    const url = product.id ? `${baseUrl}/${product.id}` : baseUrl;
    axios[method](url, product).then((resp) => {
      const list = this.getUpdatedList(resp.data);
      this.setState({ product: initialState.product, list });
    });
  }

  getUpdatedList(product, add = true) {
    const list = this.state.list.filter((u) => u.id !== product.id);
    if (add) list.unshift(product);
    return list;
  }

  updateField(event) {
    const product = { ...this.state.product };
    product[event.target.product] = event.target.value;
    this.setState({ product });
  }

  renderForm() {
    return (
      <div className="form">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>Produto</label>
              <input
                type="text"
                className="form-control"
                name="product"
                value={this.state.value}
                placeholder="Digite o nome do produto..."
                onChange={(e) => this.updateField(e)}
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>Preço</label>
              <input
                type="text"
                className="form-control"
                name="price"
                value={this.state.value}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o preço..."
              />
            </div>
          </div>
        </div>

        <hr />
        <div className="row">
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={(e) => this.save(e)}>
              Salvar
            </button>

            <button
              className="btn btn-secondary ml-2"
              onClick={(e) => this.clear(e)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  load(product) {
    this.setState({ product });
  }

  remove(product) {
    axios.delete(`${baseUrl}/${product.id}`).then((resp) => {
      const list = this.getUpdatedList(product, false);
      this.setState({ list });
    });
  }

  addToCart(product) {
    axios.get(`${baseUrl}/${product.id}`).then((resp) => {
      product = JSON.stringify(product);
      localStorage.setItem("lead", product);
    });
  }

  renderTable() {
    return (
      <table className="table mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Produto</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.state.list.map((product) => {
      return (
        <tr key={product.id}>
          <td>{product.id}</td>
          <td>{product.product}</td>
          <td>{product.price}</td>
          <td>
            <button
              className="btn btn-warning"
              onClick={() => this.load(product)}
            >
              <i className="fa fa-pencil"></i>
            </button>
            <button
              className="btn btn-danger ml-2"
              onClick={() => this.remove(product)}
            >
              <i className="fa fa-trash"></i>
            </button>
            <button
              className="btn btn-primary ml-2"
              onClick={() => this.addToCart(product)}
            >
              <i className="fa fa-shopping-cart"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <Main {...headerProps}>
        {this.renderForm()}
        {this.renderTable()}
      </Main>
    );
  }
}
