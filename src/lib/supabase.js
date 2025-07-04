import { createClient } from '@supabase/supabase-js'

// Supabase設定（実際のプロジェクトURLとキーに置き換えてください）
const SUPABASE_URL = 'YOUR_SUPABASE_URL'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'

if(SUPABASE_URL === 'YOUR_SUPABASE_URL' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY') {
  console.warn('Supabaseが設定されていません。ローカルストレージを使用します。');
}

export const supabase = SUPABASE_URL !== 'YOUR_SUPABASE_URL' 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

// データベース操作関数
export const dbOperations = {
  // 商品操作
  async getProducts() {
    if (!supabase) {
      return JSON.parse(localStorage.getItem('adminProducts') || '[]');
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active');
    
    if (error) throw error;
    return data;
  },

  async createProduct(product) {
    if (!supabase) {
      const products = JSON.parse(localStorage.getItem('adminProducts') || '[]');
      const newProduct = { ...product, id: Date.now() };
      products.push(newProduct);
      localStorage.setItem('adminProducts', JSON.stringify(products));
      return newProduct;
    }

    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // コース操作
  async getCourses() {
    if (!supabase) {
      return JSON.parse(localStorage.getItem('adminCourses') || '[]');
    }
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('status', 'published');
    
    if (error) throw error;
    return data;
  },

  async createCourse(course) {
    if (!supabase) {
      const courses = JSON.parse(localStorage.getItem('adminCourses') || '[]');
      const newCourse = { ...course, id: Date.now() };
      courses.push(newCourse);
      localStorage.setItem('adminCourses', JSON.stringify(courses));
      return newCourse;
    }

    const { data, error } = await supabase
      .from('courses')
      .insert([course])
      .select();
    
    if (error) throw error;
    return data[0];
  },

  // 注文操作
  async getOrders() {
    if (!supabase) {
      return JSON.parse(localStorage.getItem('adminOrders') || '[]');
    }
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createOrder(order) {
    if (!supabase) {
      const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
      const newOrder = { ...order, id: Date.now() };
      orders.push(newOrder);
      localStorage.setItem('adminOrders', JSON.stringify(orders));
      return newOrder;
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select();
    
    if (error) throw error;
    return data[0];
  }
};